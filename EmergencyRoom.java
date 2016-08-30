import java.util.*;
import java.io.*;

public class EmergencyRoom {
    int opCount;
    Heap<Patient> heap;

    public EmergencyRoom() {
        this.opCount = 0;
        heap = new Heap<>();
    }

    void ArriveAtHospital(String patientName, int emergencyLvl) {
        opCount++;
        Patient p = new Patient(patientName, emergencyLvl, opCount);
        heap.insert(p);
    }

    void UpdateEmergencyLvl(String patientName, int incEmergencyLvl) {
        Patient p = heap.delete(new Patient(patientName, 0, 0));
        p.emergencyLvl += incEmergencyLvl;
        heap.insert(p);
    }

    void Treat(String patientName) {
        heap.delete(new Patient(patientName, 0, 0));
    }

    String Query() {
        if(heap.elementCount == 0)
            return "The emergency room is empty";
        return heap.peekTop().name;
    }

    void run() throws Exception {
        // do not alter this method

        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        PrintWriter pr = new PrintWriter(new BufferedWriter(new OutputStreamWriter(System.out)));
        int numCMD = Integer.parseInt(br.readLine()); // note that numCMD is >= N
        while (numCMD-- > 0) {
            StringTokenizer st = new StringTokenizer(br.readLine());
            int command = Integer.parseInt(st.nextToken());
            switch (command) {
                case 0: ArriveAtHospital(st.nextToken(), Integer.parseInt(st.nextToken())); break;
                case 1: UpdateEmergencyLvl(st.nextToken(), Integer.parseInt(st.nextToken())); break;
                case 2: Treat(st.nextToken()); break;
                case 3: pr.println(Query()); break;
            }
        }
        pr.close();
    }

    public static void main(String[] args) throws Exception {
        // do not alter this method
        EmergencyRoom ps1 = new EmergencyRoom();
        ps1.run();
    }


    static class Patient implements Comparable<Patient>{
        String name;
        int emergencyLvl;
        int arrivalTime;

        public Patient(String name, int emergencyLvl, int arrivalTime) {
            this.name = name;
            this.emergencyLvl = emergencyLvl;
            this.arrivalTime = arrivalTime;
        }

        @Override
        public int compareTo(Patient patient) {
            int emergencyLvlCompare = Integer.compare(patient.emergencyLvl, this.emergencyLvl);
            // the higher the emergency level, the higher the rank is
            if(emergencyLvlCompare == 0){
                return Long.compare(this.arrivalTime, patient.arrivalTime);
                // the smaller the arrivalTime, the higher the rank is
            }else{
                return emergencyLvlCompare;
            }
        }

        @Override
        public boolean equals(Object patient){
            return patient.getClass() == Patient.class && ((Patient)patient).name.equals(this.name);
        }

        @Override
        public int hashCode(){
            return name.hashCode();
        }

        @Override
        public String toString(){
            return name + " " + emergencyLvl;
        }
    }

    static class Heap<T extends Comparable<T>>{
        Vector<T> heapData;
        HashMap<T, Integer> indexMap;
        int elementCount;

        public Heap() {
            heapData = new Vector<>();
            indexMap = new HashMap<>();
            elementCount = 0;
        }

        public void insert(T newData){
            heapData.add(newData);
            int pos = bubbleUp(elementCount);
            indexMap.put(newData, pos);
            elementCount++;
        }

        private int bubbleUp(int index){
            while(index > 0){
                int parentIndex = (index - 1) / 2;
                if(heapData.get(index).compareTo(heapData.get(parentIndex)) == -1){
                    // the current item is smaller than its parent
                    swap(index, parentIndex);
                    index = parentIndex;
                }else{
                    break;
                }
            }
            return index;
        }

        private void swap(int aIndex, int bIndex){
            T a = heapData.get(aIndex);
            T b = heapData.get(bIndex);
            heapData.set(aIndex, b);
            heapData.set(bIndex, a);
            indexMap.put(a, bIndex);
            indexMap.put(b, aIndex);
        }

        private int bubbleDown(int index){
            while(true){
                int leftChildIndex = 2 * index + 1;
                int rightChildIndex = 2 * index + 2;
                int smallestIndex = minValue(index, leftChildIndex, rightChildIndex);
                if(smallestIndex == index){
                    return index;
                }else{
                    swap(index, smallestIndex);
                    index = smallestIndex;
                }
            }
        }

        private int minValue(int aIndex, int bIndex, int cIndex){
            int result;
            if(bIndex >= elementCount || aIndex < elementCount && heapData.get(aIndex).compareTo(heapData.get(bIndex)) == -1){
                result = aIndex;
            }else{
                result = bIndex;
            }
            if(cIndex >= elementCount || heapData.get(result).compareTo(heapData.get(cIndex)) == -1){
                return result;
            }else{
                return cIndex;
            }
        }

        public T delete(int index){
            swap(index, elementCount - 1);
            T returnValue = heapData.get(--elementCount);
            heapData.remove(elementCount);
            if(index != elementCount) {
                bubbleUp(index);
                bubbleDown(index);
            }
            indexMap.remove(returnValue);
            return returnValue;
        }

        public T peekTop(){
            return heapData.get(0);
        }

        private int find(T target){
            return indexMap.get(target);
        }

        public T delete(T e){
            return delete(find(e));
        }
    }
}