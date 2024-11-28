FROM amazonlinux:2023

# Install required dependencies
RUN yum update -y && \
    yum install -y \
    git \
    openssh \
    bash \
    tar \
    wget \
    nodejs \
    npm \
    docker \
    python3 \
    python3-pip

# Install NVM (recommended by Amplify)
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Add Docker's official GPG key and repository
RUN yum install -y docker
RUN systemctl enable docker

# Clean up
RUN yum clean all && \
    rm -rf /var/cache/yum

# Set working directory
WORKDIR /app

# Start Docker service when container launches
ENTRYPOINT ["dockerd"] 