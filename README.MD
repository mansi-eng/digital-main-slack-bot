![img](https://cdn.iconscout.com/icon/free/png-256/free-chart-growth-1913955-1624750.png?f=webp)

# Stock Data

## Backend

- The backend exposes one endpoint - `/api/fetchStockData`.
- This endpoint expects a req body in json format with two keys `ticker`, `date`.
- It fetches the data for the particular date using the `Daily Open/Close` api exposed by Polygon.
- Error is returned if the polygon api responds with an error

Example request and response
Endpoint - /api/fetchStockData

Request:

```
{
    "ticker": "AAPL",
    "date": "2023-07-14"
}
```

Response:

```
{
    "message": "Data fetched successfully",
    "data": {
        "open": 190.23,
        "high": 191.1799,
        "low": 189.63,
        "close": 190.69,
        "volume": 41616242
    }
}
```

Error response:

```
{
    "error": {
        "status": "NOT_FOUND",
        "request_id": "78ccf05e99aa4460662ea5c464281a7d",
        "message": "Data not found."
    }
}
```

## Frontend

```
- App
    - TickerContainer
        - TickerDetails
            - Data
```

- The `TickerContainer` components contains a form wherein user can enter the Ticker name and date.
- It sends an api request to our backend endpoint.
- `TickerDetails` component renders the data.
- Loading and error states are handled and shown to the user.
- The submit button is disabled if user has not entered any of the fields.

### Optimal Tasks

- Autocomplete stock tickers: Dropdown showing autocompletion suggestions for tickers.
- Implement Caching Mechanism: To improve response times.
- Pagination and infinite scroll: Show historical data for multiple days if user needs to.
- Data visualization: Show candlestick charts or line charts to represent data.
- Option to export data to csv or excel.
