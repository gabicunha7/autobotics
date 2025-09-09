import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        Log log = new Log("2025-09-08 22:00:00", 10.5, 2.4, 70.0);
        Log log2 = new Log("2025-09-08 20:00:00", 20.5, 4.4, 70.8);
        Log log3 = new Log("2025-09-07 12:00:00", 8.5, 5.0, 90.0);
        Log log4 = new Log("2025-09-07 09:00:00", 16.5, 2.4, 4.6);
        Log log5 = new Log("2025-09-07 08:50:00", 2.0, 7.8, 5.5);
        Log log6 = new Log("2025-09-06 17:30:00", 3.9, 45.0, 57.0);
        Log log7 = new Log("2025-09-06 17:20:00", 10.8, 55.0, 42.5);
        Log log8 = new Log("2025-09-06 17:10:00", 19.0, 29.5, 10.0);
        Log log9 = new Log("2025-09-06 17:00:00", 7.5, 62.0, 5.5);


        ArrayList<Log> lista = new ArrayList<>();
        lista.add(log);
        lista.add(log2);
        lista.add(log3);
        lista.add(log4);
        lista.add(log5);
        lista.add(log6);
        lista.add(log7);
        lista.add(log8);
        lista.add(log9);

        RegistroLog reg = new RegistroLog(lista);

        while (true) {

            System.out.println("Selecione a forma que deseja ordenar os dados: ");
            System.out.println("1. Ordenar por porcentagem de CPU");
            System.out.println("2. Ordenar por porcentagem de RAM");
            System.out.println("3. Ordenar por porcentagem de Disco");
            System.out.println("0. Sair");
            System.out.print("Sua resposta: ");
            Integer escolha = sc.nextInt();

            if (escolha > 3 || escolha < 0) {
                System.out.println("Escolha inválida!");
            }

            if (escolha == 1) {
                reg.ordenarPorCpu();
                reg.visualizarDados();
                break;
            }
            else if (escolha == 2) {
                reg.ordenarPorRam();
                reg.visualizarDados();
                break;
            }
            else if (escolha == 3) {
                reg.ordenarPorDisco();
                reg.visualizarDados();
                break;
            }
            else if (escolha == 0) {
                System.out.println("Encerrando...");
                return;
            }

        }

        sc.close();

    }
}
