import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB
import pickle
import numpy as np
from io import StringIO



def getData(df):
    df = pd.read_csv('data.txt', delimiter=",")
    count_vect = CountVectorizer()
    col = ['answer', 'phrase']
    df = df[col]
    df = df[pd.notnull(df['phrase'])]
    df.columns = ['answer', 'phrase']
    df['answer_id'] = df['answer'].factorize()[0]
    answer_id_df = df[['answer', 'answer_id']].drop_duplicates().sort_values('answer_id')
    answer_to_id = dict(answer_id_df.values)
    id_to_answer = dict(answer_id_df[['answer_id', 'answer']].values)



def train(word):
    X_train, X_test, y_train, y_test = train_test_split(df['phrase'], df['answer'], random_state = 0)
    count_vect = CountVectorizer()
    X_train_counts = count_vect.fit_transform(X_train)
    tfidf_transformer = TfidfTransformer()
    X_train_tfidf = tfidf_transformer.fit_transform(X_train_counts)
    clf = MultinomialNB().fit(X_train_tfidf, y_train)


# save the model to disk
#     filename = 'finalized_YesNoClassifer_model.pkl'
#     pickle.dump(clf, open(filename, 'wb'))

    return (clf.predict(count_vect.transform([word]))[0])

def getAnswer(word,model):
    model.predict(count_vect.transform([word]))