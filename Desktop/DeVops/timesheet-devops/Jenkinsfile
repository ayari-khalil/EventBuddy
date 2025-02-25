
pipeline {
    agent any

    tools { 
        jdk 'JAVA_HOME' 
        maven 'M2_HOME' 
    }

    stages {
        stage('GIT') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/hamza10tn/atelier-git.git'
            }
        }

        stage('Compile Stage') {
            steps {
                sh 'mvn clean compile'
            }
        }
         stage('MVN SONARQUBE') {
            steps {
                script {
                    // Utilisation du token depuis Jenkins credentials
                    withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                        sh "mvn sonar:sonar -Dsonar.login=${SONAR_TOKEN} -Dmaven.test.skip=true"
                    }
                }
            }
         }


          /* stage('Deploy to Nexus') {
                     steps {
                         script {
                             withCredentials([usernamePassword(credentialsId: 'nexus-credentials', usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                                 sh """
                                 mvn deploy -DaltDeploymentRepository=nexus::default::http://your-nexus-server:8083/repository/maven-releases/ \
                                            -DrepositoryId=nexus \
                                            -Dnexus.username=${NEXUS_USER} \
                                            -Dnexus.password=${NEXUS_PASS}
                                 """
                             }
                         }
                     }
          }
          */
        

}
}