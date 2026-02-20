"""Progress tracking tool."""

import httpx
import os


class ProgressTracker:
    """Tracks and updates student learning progress."""

    def __init__(self):
        self.api_url = os.getenv("API_URL", "http://localhost:3000")

    async def update(
        self,
        student_id: str,
        objective_id: str,
        status: str,
        score: float = None,
    ) -> bool:
        """Update learning progress via the API."""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.api_url}/api/sessions/progress",
                    json={
                        "studentId": student_id,
                        "objectiveId": objective_id,
                        "status": status,
                        "score": score,
                    },
                )
                return response.status_code == 200
        except Exception as e:
            print(f"Progress update error: {e}")
            return False
