import requests
from requests_ntlm import HttpNtlmAuth

url = "http://20.83.145.159:7048/BC250/ODataV4/Company('MWA')/QyUserSetup?$filter=EMail%20eq%20%27enock.maeba@mwawater.org%27"
username = "MWA-Admin"  # Include domain if needed, e.g., "DOMAIN\\username"
password = "qxMJE93iKKnn"

response = requests.get(url, auth=HttpNtlmAuth(username, password))
print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
