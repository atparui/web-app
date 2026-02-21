pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_IMAGE = 'shivain22/finos-web-app'
        DOCKER_USERNAME = 'shivain22'
        DOCKER_PASSWORD = 'Asd!@#123'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Finos Web App Docker image (npm install + ng build inside Docker)...'
                    sh """
                        docker build \
                            --tag ${DOCKER_IMAGE}:${BUILD_NUMBER} \
                            --tag ${DOCKER_IMAGE}:latest \
                            --build-arg BUILDKIT_INLINE_CACHE=1 \
                            .
                    """
                }
            }
        }

        stage('Push to Registry') {
            steps {
                script {
                    echo 'Pushing Docker image to registry...'
                    sh """
                        echo ${DOCKER_PASSWORD} | docker login ${DOCKER_REGISTRY} -u ${DOCKER_USERNAME} --password-stdin
                        docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                        docker push ${DOCKER_IMAGE}:latest
                        docker logout ${DOCKER_REGISTRY}
                    """
                }
            }
        }

        stage('Deploy to Platform') {
            steps {
                script {
                    echo 'Deploying finos-web-app (mifos-web) to platform...'
                    sh 'cd /platform && ./scripts/down.sh dev mifos-web'
                    sh """
                        cd /platform && \
                        MIFOS_WEB_IMAGE_OVERRIDE=${DOCKER_IMAGE} \
                        MIFOS_WEB_IMAGE_TAG_OVERRIDE=latest \
                        ./scripts/up.sh dev mifos-web
                    """
                }
            }
        }
    }

    post {
        always {
            script {
                echo 'Cleaning up Docker images...'
                sh """
                    docker rmi ${DOCKER_IMAGE}:${BUILD_NUMBER} || true
                    docker image prune -f || true
                """
            }
        }
        success {
            echo '✅ Finos Web App pipeline succeeded!'
        }
        failure {
            echo '❌ Finos Web App pipeline failed!'
        }
    }
}
