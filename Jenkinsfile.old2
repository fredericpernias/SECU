#!/usr/bin/env groovy
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings

pipeline {
agent any
stages {
    stage('checkout') {
       steps {
                 checkout scm
	}
    }

    stage('check java') {
        steps {
                sh "java -version"
    }}

    stage('clean') {
      steps {
                  sh "chmod +x mvnw"
        sh "./mvnw clean"
    }}

    stage('install tools') {
        steps {
                sh "./mvnw com.github.eirslett:frontend-maven-plugin:install-node-and-npm -DnodeVersion=v10.16.1 -DnpmVersion=6.9.2"
    }}

    stage('npm install') {
        steps {
                sh "./mvnw com.github.eirslett:frontend-maven-plugin:npm"
    }}

   stage('snyk'){
	steps {
                snykSecurity severity: 'high', snykInstallation: 'snykInt', snykTokenId: 'SNYK_TOKEN'
    }}

//    stage('quality analysis') {
//        withSonarQubeEnv('sonarcloud') {
//            sh "./mvnw initialize sonar:sonar"
//        }
//    }
    

//    stage('package and deploy') {
//        sh "./mvnw com.heroku.sdk:heroku-maven-plugin:2.0.5:deploy -DskipTests -Pprod -Dheroku.buildpacks=heroku/jvm -Dheroku.appName=secuzapsnik"
//        archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
//    }
    stage('Setup zap') {
            steps {
                script {
                    startZap(host: "127.0.0.1", port: 9091, timeout:500, zapHome: "/opt/zaproxy", sessionPath:"/somewhere/session.session", allowedHosts:['github.com']) // Start ZAP at /opt/zaproxy/zap.sh, allowing scans on github.com (if allowedHosts is not provided, any local addresses will be used
                }
            }
        }
        stage('Build & Test zap') {
            steps {
                script {
                    sh "mvn verify -Dhttp.proxyHost=127.0.0.1 -Dhttp.proxyPort=9091 -Dhttps.proxyHost=127.0.0.1 -Dhttps.proxyPort=9091" // Proxy tests through ZAP
                }
            }
        }

}
post {
        always {
            script {
                archiveZap(failAllAlerts: 1, failHighAlerts: 0, failMediumAlerts: 0, failLowAlerts: 0, falsePositivesFilePath: "zapFalsePositives.json")
            }
        }
    } }
