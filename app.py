import os
import sys
import webview

def get_resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(os.path.dirname(__file__)) if '__file__' in globals() else os.path.abspath(".")
    return os.path.join(base_path, relative_path)

if __name__ == '__main__':
    index_html = get_resource_path('index.html')
    
    # Create webview window
    webview.create_window(
        title='NanoGarden - Pixel Gardening & Automation Game',
        url=index_html,
        width=1280,
        height=820,
        resizable=True,
        min_size=(960, 680)
    )
    # Start the webview loop (this will load Microsoft Edge WebView2 on Windows)
    webview.start()
