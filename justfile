[private]
default:
    @just --list

copy:
    rsync -avz --delete \
        --exclude='node_modules' \
        --exclude='.git' \
        --exclude='dist' \
        --exclude='backend/dist' \
        --exclude='backend/db' \
        --exclude='backend/uploads' \
        --exclude='backend/.env' \
        --exclude='.tsbuildinfo' \
        --exclude='*.log' \
        ./ tududi:/opt/tududi/

npm-install: copy
    ssh tududi "cd /opt/tududi && npm install"

deploy: copy npm-install
    ssh tududi /root/rebuild-tududi

logs:
    ssh -t tududi journalctl -u tududi -f -n 100
