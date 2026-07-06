Console.OutputEncoding = System.Text.Encoding.UTF8;

Console.WriteLine("===================================");
Console.WriteLine("   ROBO PROFESSOR - LICAO DE CASA 🤖📚");
Console.WriteLine("===================================");
Console.WriteLine("");

// O robô faz uma pergunta:
Console.WriteLine("Qual é o seu nome?");

// O robô ESPERA você digitar e guarda o que você escreveu numa "caixinha" chamada nome:
string nome = Console.ReadLine();

// Agora o robô te chama pelo nome!
Console.WriteLine("Prazer em te conhecer, " + nome + "! 😄");

while (true)
{

    // O robô mostra o que ele sabe fazer:
    Console.WriteLine("Com o que você quer ajuda?");
    Console.WriteLine("Digite 1 - Somar (juntar) ➕");
    Console.WriteLine("Digite 2 - Subtrair (tirar) ➖");
    Console.WriteLine("Digite 3 - Multiplicar (vezes) ✖️");
    Console.WriteLine("Digite 4 - Ver a tabuada de um número 📋");
    Console.WriteLine("Digite 5 - Sair 👋");

    string escolha = Console.ReadLine();

    if (escolha == "5")
    {
        Console.WriteLine("Tchau! Bons estudos! 👋📚");
        break;
    }

    // ===== SE ESCOLHER SOMAR =====
    if (escolha == "1")
    {
        Console.WriteLine("Vamos somar! Digite o primeiro número:");
        int a = int.Parse(Console.ReadLine());

        Console.WriteLine("Agora o segundo número:");
        int b = int.Parse(Console.ReadLine());

        int resultado = a + b;
        Console.WriteLine("A resposta é: " + a + " + " + b + " = " + resultado + " ✅");
    }

    // ===== SE ESCOLHER SUBTRAIR =====
    else if (escolha == "2")
    {
        Console.WriteLine("Vamos subtrair! Digite o número maior:");
        int a = int.Parse(Console.ReadLine());

        Console.WriteLine("Agora o número que você vai tirar:");
        int b = int.Parse(Console.ReadLine());

        int resultado = a - b;
        Console.WriteLine("A resposta é: " + a + " - " + b + " = " + resultado + " ✅");
    }

    // ===== SE ESCOLHER MULTIPLICAR =====
    else if (escolha == "3")
    {
        Console.WriteLine("Vamos multiplicar! Digite o primeiro número:");
        int a = int.Parse(Console.ReadLine());

        Console.WriteLine("Agora o segundo número:");
        int b = int.Parse(Console.ReadLine());

        int resultado = a * b;
        Console.WriteLine("A resposta é: " + a + " x " + b + " = " + resultado + " ✅");
    }

    // ===== SE ESCOLHER A TABUADA =====
    else if (escolha == "4")
    {
        Console.WriteLine("Qual tabuada você quer ver?");
        int numero = int.Parse(Console.ReadLine());

        Console.WriteLine("Aqui está a tabuada do " + numero + ":");

        // Esse é o truque novo! Repetir de 1 até 10:
        for (int i = 1; i <= 10; i++)
        {
            Console.WriteLine(numero + " x " + i + " = " + (numero * i));
        }
    }

    // ===== SE DIGITAR QUALQUER OUTRA COISA =====
    else
    {
        Console.WriteLine("Ops, eu não conheço essa opção. Tente 1, 2, 3 ou 4! 🤔");
    }
}