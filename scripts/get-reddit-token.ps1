# Reddit App Credentials
$CLIENT_ID = "GH_K4D5dw9Znl3jMrlpwuQ"
$CLIENT_SECRET = "mxm27ds5YrM4f06aoSQ1nb-A-4nxag"
$REDIRECT_URI = "http://localhost:8080/callback"

# Generate random state
$state = -join ((65..90) + (97..122) | Get-Random -Count 16 | % {[char]$_})

# Define scopes
$SCOPES = "identity submit edit vote read"

# Create authorization URL
$authUrl = "https://www.reddit.com/api/v1/authorize?" +
           "client_id=$CLIENT_ID&" +
           "response_type=code&" +
           "state=$state&" +
           "redirect_uri=$([Uri]::EscapeDataString($REDIRECT_URI))&" +
           "duration=permanent&" +
           "scope=$([Uri]::EscapeDataString($SCOPES))"

Write-Host "Visit this URL in your browser to authorize the app:"
Write-Host $authUrl
Write-Host "`nAfter authorization, you'll be redirected to a URL like:"
Write-Host "http://localhost:8080/callback?state=xyz&code=ABC123..."
Write-Host "`nPaste ONLY the code value (the part after 'code=' and before any '#' or '&'):"
$code = Read-Host "Enter the code"

# Exchange code for tokens
$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${CLIENT_ID}:${CLIENT_SECRET}"))
$headers = @{
    "Authorization" = "Basic $base64Auth"
    "Content-Type" = "application/x-www-form-urlencoded"
}

$body = "grant_type=authorization_code&code=$code&redirect_uri=$([Uri]::EscapeDataString($REDIRECT_URI))"

try {
    $response = Invoke-RestMethod `
        -Uri "https://www.reddit.com/api/v1/access_token" `
        -Method Post `
        -Headers $headers `
        -Body $body

    Write-Host "`nRefresh Token: $($response.refresh_token)"
    Write-Host "Access Token: $($response.access_token)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $result = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($result)
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody"
    }
}