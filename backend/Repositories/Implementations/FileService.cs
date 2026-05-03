using Amazon.S3;
using Amazon.S3.Transfer;
using FarmAssessmentAPI.Services.Interfaces;
using FarmAssessmentAPI.Config;

namespace FarmAssessmentAPI.Services.Implementations;

public class FileService : IFileService
{
    private readonly IAmazonS3 _s3;
    private readonly AwsSettings _config;

    public FileService(IAmazonS3 s3, AwsSettings config)
    {
        _s3 = s3;
        _config = config;
    }

    public async Task<string> UploadAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new Exception("Invalid file");

        if (!file.ContentType.StartsWith("image/"))
            throw new Exception("Only image allowed");

        var key = $"farms/{Guid.NewGuid()}_{file.FileName}";

        using var stream = file.OpenReadStream();

        var transfer = new TransferUtility(_s3);

        await transfer.UploadAsync(new TransferUtilityUploadRequest
        {
            InputStream = stream,
            BucketName = _config.BucketName,
            Key = key,
            ContentType = file.ContentType
        });

        return $"https://{_config.BucketName}.s3.amazonaws.com/{key}";
    }
}