var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapPost("/api/somar", (OperacaoRequest req) =>
    Results.Ok(new OperacaoResponse(req.A, req.B, req.A + req.B)));

app.MapPost("/api/subtrair", (OperacaoRequest req) =>
    Results.Ok(new OperacaoResponse(req.A, req.B, req.A - req.B)));

app.MapPost("/api/multiplicar", (OperacaoRequest req) =>
    Results.Ok(new OperacaoResponse(req.A, req.B, req.A * req.B)));

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
        .Select(i => new TabuadaLinha(i, req.Numero * i))
        .ToArray();

    return Results.Ok(new TabuadaResponse(req.Numero, linhas));
});

app.Run();

record OperacaoRequest(int A, int B);
record OperacaoResponse(int A, int B, int Resultado);
record DivisaoResponse(int A, int B, double Resultado);
record TabuadaRequest(int Numero);
record TabuadaLinha(int I, int Resultado);
record TabuadaResponse(int Numero, TabuadaLinha[] Linhas);
