import http.server
import socketserver
import sys

PORT = 8000

# Use SimpleHTTPRequestHandler to serve files from the current directory
Handler = http.server.SimpleHTTPRequestHandler

try:
    # Create a TCP server that listens on all interfaces and the specified port
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Server running at http://localhost:{PORT}")
        print("Press Ctrl+C to stop the server")
        httpd.serve_forever()  # Start the server and keep it running
except OSError as e:
    # Handle the case where the port is already in use
    if e.errno == 98:  # Address already in use (common on Linux/macOS)
        print(f"Error: Port {PORT} is already in use.")
        print("Please close the other process or use a different port.")
    elif e.errno == 10048: # Address already in use (common on Windows)
        print(f"Error: Port {PORT} is already in use.")
        print("Please close the other process or use a different port.")
    else:
        print(f"An unexpected error occurred: {e}")
    sys.exit(1)  # Exit with an error code
except KeyboardInterrupt:
    # Handle Ctrl+C to gracefully shut down the server
    print("\nServer stopped by user.")
    sys.exit(0)  # Exit normally
