var builder = DistributedApplication.CreateBuilder(args);

const string publicHost = "sparc.apps.vensas.de";

// nginx with the built pages. The build context is the repository root, because the build reads the record of sparc.
var site = builder.AddDockerfile("sparc-web", "../..", "website/Dockerfile")
    .WithHttpEndpoint(targetPort: 8080)
    .WithExternalHttpEndpoints();

if (builder.ExecutionContext.IsPublishMode)
{
    // The address of the server comes from the deployment, never from the repository.
    var server = builder.Configuration["DEPLOY_HOST"];
    if (string.IsNullOrWhiteSpace(server))
    {
        throw new InvalidOperationException("DEPLOY_HOST is missing. Set it to the address of the server.");
    }

    // kamal-proxy routes by host name, so the site can share the server with other apps.
    // It gets and renews the Let's Encrypt certificate.
    builder.AddKamalEnvironment("kamal")
        .WithServers(server)
        .WithRegistry("ghcr.io", builder.Configuration["KAMAL_REGISTRY_USERNAME"] ?? "vensas");

    site.WithEnvironment("SITE_HOST", publicHost)
        .PublishAsKamalService((_, config) =>
        {
            config.Proxy = new() { Host = publicHost, Ssl = true, AppPort = 8080, Healthcheck = new() { Path = "/health" } };
            // Without this, Kamal does not register the app with kamal-proxy.
            config.Servers["web"].Proxy = true;
        });
}
else
{
    site.WithEnvironment("SITE_HOST", "localhost");
}

builder.Build().Run();
