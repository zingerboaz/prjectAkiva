def open_access_middleware(get_response):
    def middleware(request):
        response = get_response(request)
        # response["Access-Control-Allow-Origin"] = "http://bney_akiva.test:22830"
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Credentials"] = 'true'
        response["Access-Control-Allow-Headers"] = "*"
        return response
    return middleware
