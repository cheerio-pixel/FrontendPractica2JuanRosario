
using Microsoft.AspNetCore.Authentication.Cookies;

namespace frontend;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();

        // // Add services to the container.
        // builder.Services.AddAuthorization(options =>
        //     {
        //         options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
        //     }
        // );
        // builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
        //     .AddCookie(options =>
        //     {
        //         options.Cookie.Name = "SessionID";
        //         options.LoginPath = "/Login";
        //         options.LogoutPath = "/Logout";
        //     });


        var app = builder.Build();

        app.Use(async (context, next) =>
        {
            await next();

            if (context.Response.StatusCode == 404 &&
                !Path.HasExtension(context.Request.Path.Value))
            {
                // Don't report back as not found unless next changes it.
                context.Response.StatusCode = 200;
                context.Request.Path = "/index.html";
                await next();
            }
        });

        // Really important, is the thing that powers the server.
        app.UseFileServer();

        // Configure the HTTP request pipeline.

        app.UseHttpsRedirection();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}
