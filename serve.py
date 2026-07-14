#!/usr/bin/env python3
"""Dev server: like http.server but disables browser caching."""
import http.server, functools

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()

http.server.test(HandlerClass=functools.partial(NoCacheHandler, directory="/Users/tanmay/Documents/veloura"), port=8471)
