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

    stage('quality analysis') {
        withSonarQubeEnv('sonarcloud') {
            sh "./mvnw initialize sonar:sonar"
        }
    }

    stage('Run Tests') {
            parallel {     
   stage('backend tests') {
//        try {
//            sh "./mvnw verify"
//        } catch(err) {
//            throw err
//        } finally {
//            junit '**/target/test-results/**/TEST-*.xml'
//        }
    }

    stage('frontend tests') {
//        try {
//            sh "./mvnw com.github.eirslett:frontend-maven-plugin:npm -Dfrontend.npm.arguments='run test'"
//        } catch(err) {
//            throw err
//        } finally {
//            junit '**/target/test-results/TESTS-*.xml'
//        }
    }
   }
   }

    stage('package and deploy') {
        sh "./mvnw com.heroku.sdk:heroku-maven-plugin:2.0.5:deploy -DskipTests -Pprod -Dheroku.buildpacks=heroku/jvm -Dheroku.appName=secuzapsnik"
        archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
    }

}
