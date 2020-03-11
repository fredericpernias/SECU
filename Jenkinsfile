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


	//    stage('package and deploy') {
	//        sh "./mvnw com.heroku.sdk:heroku-maven-plugin:2.0.5:deploy -DskipTests -Pprod -Dheroku.buildpacks=heroku/jvm -Dheroku.appName=secuzapsnik"
	//        archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
	//    }
	stage('Setup zap') {
		startZap(host: "127.0.0.1", port: 9091, timeout:500, zapHome: "", sessionPath:"/session.session", allowedHosts:['github.com']) 
	}
	stage('Build & Test zap') {
		sh "mvn verify -Dhttp.proxyHost=127.0.0.1 -Dhttp.proxyPort=9091 -Dhttps.proxyHost=127.0.0.1 -Dhttps.proxyPort=9091" 
	}

}
post {
	always {
		archiveZap(failAllAlerts: 1, failHighAlerts: 0, failMediumAlerts: 0, failLowAlerts: 0, falsePositivesFilePath: "zapFalsePositives.json")
	}
}
