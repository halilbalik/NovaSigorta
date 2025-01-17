namespace NovaSigorta.Application.DTOs;

public class ResponseDto<T>
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Data { get; set; }
    public List<string> Errors { get; set; } = new();

    public static ResponseDto<T> SuccessResult(T data, string message = "İşlem başarılı")
    {
        return new ResponseDto<T>
        {
            Success = true,
            Message = message,
            Data = data
        };
    }

    public static ResponseDto<T> ErrorResult(string message, List<string>? errors = null)
    {
        return new ResponseDto<T>
        {
            Success = false,
            Message = message,
            Errors = errors ?? new List<string>()
        };
    }
}

public class ResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public List<string> Errors { get; set; } = new();

    public static ResponseDto SuccessResult(string message = "İşlem başarılı")
    {
        return new ResponseDto
        {
            Success = true,
            Message = message
        };
    }

    public static ResponseDto ErrorResult(string message, List<string>? errors = null)
    {
        return new ResponseDto
        {
            Success = false,
            Message = message,
            Errors = errors ?? new List<string>()
        };
    }
}
