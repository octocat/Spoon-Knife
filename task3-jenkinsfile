pipeline {

    agent any
    stages {
        stage("Build") {
            steps {
                sh "./gradlew assemble"
            }
        }
        stage("Test") {
            steps {
                sh "./gradlew test"
            }
        }
    }
}
