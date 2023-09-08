import time
import hmac
import requests
from fastapi import FastAPI, HTTPException

app = FastAPI()

# TODO: Configure your Authento settings
API_KEY = "YOUR_API_KEY"
API_SECRET = "YOUR_API_SECRET"
ENDPOINT = "https://api.authento.io/v1/userinfo/basic"


@app.get("/userinfo/basic")
async def get_basic_userinfo(address: str):
    """
    Returns the KYC status of an address retrieved using Authento API
    @api {get} /userinfo/basic?address=:address
    @apiParam {String} address EVM compatible address
    @apiSuccess {String="unverified","processing","info_required",verified","rejected"}
        status KYC status of the address
    @apiSuccess {String="individual","company"}
        type User type
    @apiError {String} detail Error detail
    """
    try:
        timestamp = int(time.time() * 1000)
        payload = f'{timestamp}GET{ENDPOINT}?address={address}'.encode()
        signature = hmac.new(API_SECRET.encode(), payload,
                             'sha256').hexdigest()
        headers = {
            "X-AUTHENTO-APIKEY": API_KEY,
            "X-AUTHENTO-SIGNATURE": signature,
            "X-AUTHENTO-TS": str(timestamp),
        }
        params = {
            "address": address
        }
        response = requests.get(ENDPOINT, headers=headers, params=params)
        user_data = response.json()
        # TODO: Implement additional filters based on user attributes such as
        #  nationality/age/pep/riskScore as needed.
        #  Fields other than 'status' and 'verified' should not be included
        #  in the response as they might contain sensitive information.
        return {
            "status": user_data['result']['status'],
            "type": user_data['result']['type']
        }
    except:
        raise HTTPException(
            status_code=400, detail="Failed to retrieve basic user info")
