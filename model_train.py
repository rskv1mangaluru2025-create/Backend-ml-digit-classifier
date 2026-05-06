# model_train.py
import numpy as np
import joblib
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Step 1: Create a synthetic dataset for the Dance School
# Features: [Age, Years of Experience, Flexibility Score (1-10)]
# Labels: 0: Ballet, 1: Hip Hop, 2: Jazz, 3: Salsa
def create_dataset():
    # Number of samples
    n_samples = 1000
    
    # Feature 0: Age (5 to 60)
    age = np.random.randint(5, 60, n_samples)
    
    # Feature 1: Experience (0 to 20 years)
    experience = np.random.randint(0, 21, n_samples)
    
    # Feature 2: Flexibility (1 to 10)
    flexibility = np.random.randint(1, 11, n_samples)
    
    X = np.column_stack((age, experience, flexibility))
    
    # Simple logic for synthetic labels
    y = []
    for i in range(n_samples):
        if flexibility[i] > 8 and age[i] < 20:
            y.append(0) # Ballet (High flexibility, young)
        elif age[i] > 25 and flexibility[i] < 5:
            y.append(3) # Salsa (Older, less flexible focus)
        elif experience[i] > 5 and flexibility[i] > 6:
            y.append(2) # Jazz (Experience + Flexibility)
        else:
            y.append(1) # Hip Hop (Default)
            
    return X, np.array(y)

# Step 2: Train the model
def train():
    print("Generating dataset...")
    X, y = create_dataset()
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Initialize and train Scikit-learn model
    print("Training DecisionTreeClassifier...")
    model = DecisionTreeClassifier(random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Training Complete. Accuracy: {accuracy * 100:.2f}%")
    
    # Step 3: Save the model
    joblib.dump(model, 'model.pkl')
    print("Model saved to model.pkl")

if __name__ == "__main__":
    train()
