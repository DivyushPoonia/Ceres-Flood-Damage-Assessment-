using FarmAssessmentAPI.Data;
using FarmAssessmentAPI.Repositories.Interfaces;
using FarmAssessmentAPI.Repositories.Implementations;
using FarmAssessmentAPI.Services.Interfaces;
using FarmAssessmentAPI.Services.Implementations;
using Microsoft.EntityFrameworkCore;
using Amazon;
using Amazon.S3;
using FarmAssessmentAPI.Config;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var awsSettings = builder.Configuration.GetSection("AWS").Get<AwsSettings>();
builder.Services.AddSingleton(awsSettings);

builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    return new AmazonS3Client(
        awsSettings.AccessKey,
        awsSettings.SecretKey,
        RegionEndpoint.GetBySystemName(awsSettings.Region)
    );
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .AllowAnyOrigin()   // 🔥 for dev (later restrict)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddScoped<IFarmRepository, FarmRepository>();
builder.Services.AddScoped<IFarmService, FarmService>();
builder.Services.AddSingleton<IFileService, FileService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.Use(async (context, next) =>
{
    context.Response.Headers.Add("Access-Control-Allow-Origin", "*");
    context.Response.Headers.Add("Access-Control-Allow-Headers", "*");
    context.Response.Headers.Add("Access-Control-Allow-Methods", "*");

    if (context.Request.Method == "OPTIONS")
    {
        context.Response.StatusCode = 200;
        return;
    }

    await next();
});

app.UseSwagger();
app.UseSwaggerUI();

app.UseRouting();
app.UseCors("AllowFrontend");
app.UseAuthorization();

app.MapControllers();

app.Run();