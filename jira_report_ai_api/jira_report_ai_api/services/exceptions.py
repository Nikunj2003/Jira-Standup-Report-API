class OpenAIAPIException(Exception):
    """Custom exception for errors from the OpenAI API."""
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)
