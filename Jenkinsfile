#!/usr/bin/env groovy

node {
    stage('checkout') {
        checkout scm
    }

    stage('check java') {
        sh "java -version"
    }

    stage('clean') {
        sh "chmod +x mvnw"
        sh "./mvnw clean"
    }

    stage('install tools') {
        sh "./mvnw com.github.eirslett:frontend-maven-plugin:install-node-and-npm -DnodeVersion=v10.16.1 -DnpmVersion=6.9.2"
    }

    stage('npm install') {
        sh "./mvnw com.github.eirslett:frontend-maven-plugin:npm"
    }

   stage('snyk'){
	snykSecurity severity: 'high', snykInstallation: 'snykInt', snykTokenId: 'SNYK_TOKEN'
    }

//    stage('quality analysis') {
//        withSonarQubeEnv('sonarcloud') {
//            sh "./mvnw initialize sonar:sonar"
//        }
//    }
    
    stage('Run Tests') {
            parallel {     
   'backend tests': {
	 try {
            sh "./mvnw verify"
        } catch(err) {
            throw err
        } finally {
            junit '**/target/test-results/**/TEST-*.xml'
        }
    }

    'frontend tests') : {
	 try {
            sh "./mvnw com.github.eirslett:frontend-maven-plugin:npm -Dfrontend.npm.arguments='run test'"
        } catch(err) {
            throw err
        } finally {
            junit '**/target/test-results/TESTS-*.xml'
        }}
   }
   }

//    stage('package and deploy') {
//        sh "./mvnw com.heroku.sdk:heroku-maven-plugin:2.0.5:deploy -DskipTests -Pprod -Dheroku.buildpacks=heroku/jvm -Dheroku.appName=secuzapsnik"
//        archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
//    }
    stage('Setup zap') {
                    startZap(host: "127.0.0.1", port: 9091, timeout:500, zapHome: "/opt/zaproxy", sessionPath:"/somewhere/session.session", allowedHosts:['github.com']) // Start ZAP at /opt/zaproxy/zap.sh, allowing scans on github.com (if allowedHosts is not provided, any local addresses will be used
        }
        stage('Build & Test zap') {
                    sh "mvn verify -Dhttp.proxyHost=127.0.0.1 -Dhttp.proxyPort=9091 -Dhttps.proxyHost=127.0.0.1 -Dhttps.proxyPort=9091" // Proxy tests through ZAP
        }

}
post {
        always {
                archiveZap(failAllAlerts: 1, failHighAlerts: 0, failMediumAlerts: 0, failLowAlerts: 0, falsePositivesFilePath: "zapFalsePositives.json")
        }
    }
