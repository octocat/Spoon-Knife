################################################################################
#
#  Permission is hereby granted, free of charge, to any person obtaining a
#  copy of this software and associated documentation files (the "Software"),
#  to deal in the Software without restriction, including without limitation
#  the rights to use, copy, modify, merge, publish, distribute, sublicense,
#  and/or sell copies of the Software, and to permit persons to whom the
#  Software is furnished to do so, subject to the following conditions:
#
#  The above copyright notice and this permission notice shall be included in
#  all copies or substantial portions of the Software.
#
#  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
#  OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
#  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
#  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
#  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
#  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
#  DEALINGS IN THE SOFTWARE.
import json
import random
import urllib.request
import time

# Server API URL
QUERY = "http://localhost:8080/query?id={}"

# Number of server requests
N = 500

def getDataPoint(quote):
    """Produce all the needed values to generate a data point"""
    stock = quote['stock']
    bid_price = float(quote['top_bid']['price'])
    ask_price = float(quote['top_ask']['price'])
    return stock, (bid_price + ask_price) / 2, bid_price  # Include bid price as well

def getRatio(price_a, price_b):
    """Get ratio of price_a and price_b"""
    if price_b == 0:
        return None  # Avoid division by zero
    return price_a / price_b

def main():
    # Query the price once every N seconds.
    for _ in range(N):
        try:
            # Retrieve quotes from the server
            quotes = json.loads(urllib.request.urlopen(QUERY.format(random.random())).read())

            # Create a dictionary to store stock prices
            prices = {}

            # Calculate and print ratios for each quote
            for quote in quotes:
                stock, price, bid_price = getDataPoint(quote)
                prices[stock] = price  # Store the price in the dictionary

            for quote in quotes:
                stock, price, bid_price = getDataPoint(quote)
                ratio = getRatio(prices[stock], bid_price)  # Use the bid price for the ratio
                if ratio is not None:
                    print("Quoted %s at (bid:%s, ask:%s, ratio:%s)" % (stock, bid_price, price, ratio))

            # Add a delay before the next request
            time.sleep(1)

        except Exception as e:
            print("Error:", e)

if __name__ == "__main__":
    main()