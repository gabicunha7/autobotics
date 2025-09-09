public class Log {
    private String dataHora;
    private Double cpuPercent;
    private Double ramPercent;
    private Double diskPercent;

    public Log(String dataHora, Double cpuPercent, Double ramPercent, Double diskPercent) {
        this.dataHora = dataHora;
        this.cpuPercent = cpuPercent;
        this.ramPercent = ramPercent;
        this.diskPercent = diskPercent;
    }


    public String getDataHora() {
        return this.dataHora;
    }

    public Double getCpuPercent() {
        return this.cpuPercent;
    }

    public Double getRamPercent() {
        return this.ramPercent;
    }

    public Double getDiskPercent() {
        return this.diskPercent;
    }

    public void setCpuPercent(Double cpuPercent) {
        this.cpuPercent = cpuPercent;
    }

    public void setDataHora(String dataHora) {
        this.dataHora = dataHora;
    }

    public void setRamPercent(Double ramPercent) {
        this.ramPercent = ramPercent;
    }

    public void setDiskPercent(Double diskPercent) {
        this.diskPercent = diskPercent;
    }

    @Override
    public String toString() {
        return "{Data: " + this.dataHora + ", Porcentagem de CPU: " + this.cpuPercent +
                ", Porcentagem de RAM: " + this.ramPercent + ", Porcentagem do Disco: " + this.diskPercent + "}";
    }
}
