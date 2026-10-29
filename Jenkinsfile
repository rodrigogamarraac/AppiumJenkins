pipeline {
    agent any

    options {
        // Evita que Jenkins haga un checkout automático antes de limpiar
        skipDefaultCheckout(true)
        timestamps()
    }

    environment {
        ALLURE_RESULTS = "${env.WORKSPACE}/allure-results"
        ALLURE_REPORT  = "${env.WORKSPACE}/allure-report"
    }

    stages {
        stage('Preparar Workspace') {
            steps {
                echo 'Limpiando workspace...'
                deleteDir()
            }
        }

        stage('Checkout') {
            steps {
                echo 'Descargando proyecto desde GitHub...'
                git branch: 'main',
                    url: 'https://github.com/rodrigogamarraac/AppiumJenkins.git'
            }
        }

        stage('Instalar dependencias') {
            steps {
                echo 'Instalando dependencias del proyecto...'
                bat 'npm ci'
            }
        }

        stage('Limpiar resultados anteriores') {
            steps {
                echo 'Eliminando resultados Allure anteriores...'
                bat 'npx rimraf allure-results allure-report'
            }
        }

        stage('Ejecutar WDIO en BrowserStack') {
            steps {
                echo 'Ejecutando pruebas de Appium y WDIO en BrowserStack...'

                catchError(
                    buildResult: 'FAILURE',
                    stageResult: 'FAILURE'
                ) {
                    withCredentials([
                        usernamePassword(
                            credentialsId: 'browserstack-credentials',
                            usernameVariable: 'BROWSERSTACK_USERNAME',
                            passwordVariable: 'BROWSERSTACK_ACCESS_KEY'
                        )
                    ]) {
                        bat 'npm run wdio'
                    }
                }
            }
        }

        stage('Generar reporte Allure') {
            steps {
                echo 'Generando reporte HTML de Allure...'

                bat '''
                if exist allure-results\\*.json (
                    npx allure generate "%ALLURE_RESULTS%" --clean -o "%ALLURE_REPORT%"
                ) else (
                    echo No se encontraron resultados de Allure.
                )
                '''
            }
        }

        stage('Publicar reporte Allure en Jenkins') {
            steps {
                echo 'Publicando resultados mediante el plugin de Allure...'

                allure([
                    includeProperties: false,
                    jdk: '',
                    results: [[path: 'allure-results']],
                    reportBuildPolicy: 'ALWAYS'
                ])
            }
        }
    }

    post {
        success {
            echo 'Las pruebas finalizaron correctamente.'
        }

        failure {
            echo 'La pipeline termino con errores. Revisa la consola y el reporte Allure.'
        }

        always {
            echo 'Pipeline finalizada.'
        }
    }
}