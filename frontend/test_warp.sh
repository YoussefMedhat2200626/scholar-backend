#!/bin/bash
sudo apt-get update
sudo apt-get install -y curl gpg
curl -fsSL https://pkg.cloudflareclient.com/pubkey.gpg | sudo gpg --yes --dearmor --output /usr/share/keyrings/cloudflare-warp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/cloudflare-warp-archive-keyring.gpg] https://pkg.cloudflareclient.com/ $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/cloudflare-client.list
sudo apt-get update && sudo apt-get install -y cloudflare-warp
warp-cli --accept-tos register
warp-cli --accept-tos connect
sleep 5
curl https://www.cloudflare.com/cdn-cgi/trace
warp-cli --accept-tos disconnect
