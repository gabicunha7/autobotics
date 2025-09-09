import java.util.ArrayList;

public class RegistroLog {
    private ArrayList<Log> registro = new ArrayList<>();


    public RegistroLog(ArrayList<Log> registro) {
        this.registro = registro;
    }

    public void visualizarDados() {
        for (Log log : this.registro) {
            System.out.println(log.toString());
        }
    }

    public void ordenarPorCpu() {
        for(int i = 0; i < this.registro.size() - 1; i++) {
            int indiceMaior = i;
            for(int j = i+1; j < this.registro.size(); j++) {
                if(this.registro.get(j).getCpuPercent() > this.registro.get(indiceMaior).getCpuPercent()) {
                    indiceMaior = j;
                }
            }
            Log aux = this.registro.get(i);
            this.registro.set(i, this.registro.get(indiceMaior));
            this.registro.set(indiceMaior, aux);
        }
    }

    public void ordenarPorRam() {
        for(int i = 0; i < this.registro.size() - 1; i++) {
            int indiceMaior = i;
            for(int j = i+1; j < this.registro.size(); j++) {
                if(this.registro.get(j).getRamPercent() > this.registro.get(indiceMaior).getRamPercent()) {
                    indiceMaior = j;
                }
            }
            Log aux = this.registro.get(i);
            this.registro.set(i, this.registro.get(indiceMaior));
            this.registro.set(indiceMaior, aux);
        }
    }

    public void ordenarPorDisco() {
        for(int i = 0; i < this.registro.size() - 1; i++) {
            int indiceMaior = i;
            for(int j = i+1; j < this.registro.size(); j++) {
                if(this.registro.get(j).getDiskPercent() > this.registro.get(indiceMaior).getDiskPercent()) {
                    indiceMaior = j;
                }
            }
            Log aux = this.registro.get(i);
            this.registro.set(i, this.registro.get(indiceMaior));
            this.registro.set(indiceMaior, aux);
        }
    }

    public void setRegistro(ArrayList<Log> registro) {
        this.registro = registro;
    }

}
