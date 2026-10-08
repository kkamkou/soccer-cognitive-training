use axum::{
    routing::{get, post},
    Json, Router
};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct User {
    id: u64,
    username: String
}

#[tokio::main]
async fn main() {
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    let app = Router::new()
        .route("/user", get(get_user))
        .route("/user", post(create_user));

    axum::serve(listener, app).await.unwrap();
}

async fn get_user() -> Json<User> {
    Json(
        User {
            id: 1,
            username: "ferris_the_crab".to_string()
        }
    )
}

async fn create_user(Json(payload): Json<User>) -> Json<User> {
    Json(payload)
}