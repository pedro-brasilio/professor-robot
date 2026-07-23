using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// O frontend fica na pasta ../frontend (fora do backend).
// Servimos os arquivos estáticos de lá em vez do wwwroot padrão.
var frontendPath = Path.GetFullPath(
    Path.Combine(builder.Environment.ContentRootPath, "..", "frontend"));

if (Directory.Exists(frontendPath))
{
    var frontendFiles = new PhysicalFileProvider(frontendPath);
    app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = frontendFiles });
    app.UseStaticFiles(new StaticFileOptions { FileProvider = frontendFiles });
}

// Usamos long nos resultados para evitar estouro (overflow) de int quando
// os números digitados são muito grandes.
app.MapPost("/api/somar", (OperacaoRequest req) =>
    Results.Ok(new OperacaoResponse(req.A, req.B, (long)req.A + req.B)));

app.MapPost("/api/subtrair", (OperacaoRequest req) =>
    Results.Ok(new OperacaoResponse(req.A, req.B, (long)req.A - req.B)));

app.MapPost("/api/multiplicar", (OperacaoRequest req) =>
    Results.Ok(new OperacaoResponse(req.A, req.B, (long)req.A * req.B)));

app.MapPost("/api/dividir", (OperacaoRequest req) =>
{
    if (req.B == 0)
    {
        return Results.BadRequest(new { mensagem = "Não é possível dividir por zero." });
    }

    return Results.Ok(new DivisaoResponse(req.A, req.B, (double)req.A / req.B));
});

app.MapPost("/api/tabuada", (TabuadaRequest req) =>
{
    var linhas = Enumerable.Range(1, 10)
        .Select(i => new TabuadaLinha(i, (long)req.Numero * i))
        .ToArray();

    return Results.Ok(new TabuadaResponse(req.Numero, linhas));
});

app.Run();

record OperacaoRequest(int A, int B);
record OperacaoResponse(int A, int B, long Resultado);
record DivisaoResponse(int A, int B, double Resultado);
record TabuadaRequest(int Numero);
record TabuadaLinha(int I, long Resultado);
record TabuadaResponse(int Numero, TabuadaLinha[] Linhas);
