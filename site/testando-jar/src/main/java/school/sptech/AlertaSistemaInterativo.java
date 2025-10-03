package school.sptech;

import java.util.Scanner;

public class AlertaSistemaInterativo {

    // Limites de alerta
    private static final double LIMITE_CPU_TOTAL = 90.0;
    private static final double LIMITE_CPU_CORE = 85.0;
    private static final double LIMITE_RAM = 90.0;
    private static final double LIMITE_DISCO = 90.0;

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Perguntas ao usuário
        System.out.print("Informe o uso total da CPU (%): ");
        double cpuTotal = scanner.nextDouble();

        System.out.print("Informe o número de núcleos da CPU: ");
        int numNucleos = scanner.nextInt();

        double[] usoNucleos = new double[numNucleos];
        for (int i = 0; i < numNucleos; i++) {
            System.out.printf("Informe o uso do núcleo %d da CPU (%%): ", i + 1);
            usoNucleos[i] = scanner.nextDouble();
        }

        System.out.print("Informe o uso da memória RAM (%): ");
        double ram = scanner.nextDouble();

        System.out.print("Informe o uso do disco rígido (%): ");
        double disco = scanner.nextDouble();

        System.out.println("\nVerificando estado dos componentes...\n");

        boolean alerta = false;

        if (cpuTotal > LIMITE_CPU_TOTAL) {
            System.out.printf("Alerta: CPU total em %.1f%% de uso%n", cpuTotal);
            alerta = true;
        }

        for (int i = 0; i < numNucleos; i++) {
            if (usoNucleos[i] > LIMITE_CPU_CORE) {
                System.out.printf("Alerta: Núcleo %d da CPU em %.1f%% de uso%n", i + 1, usoNucleos[i]);
                alerta = true;
            }
        }

        if (ram > LIMITE_RAM) {
            System.out.printf("Alerta: Memória RAM em %.1f%% de uso%n", ram);
            alerta = true;
        }

        if (disco > LIMITE_DISCO) {
            System.out.printf("Alerta: Disco rígido em %.1f%% de uso%n", disco);
            alerta = true;
        }

        if (!alerta) {
            System.out.println("Todos os componentes estão em estado estável. Nenhum alerta crítico detectado.");
        }

        scanner.close();
    }
}