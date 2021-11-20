"""
    To test the anosmia Yes_No classification model
"""

# Importing the needed libraries
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB

# initializing the directory containing the training data
df = pd.read_csv('./Anosmia/yes_no_classifier/data.txt', delimiter = ",")

count_vect = CountVectorizer()


def getData(df):
    """
        retrieving needed data from the dataframe(df)
        :param df
    """

    col = ['answer', 'phrase']
    df = df[col]
    df = df[pd.notnull(df['phrase'])]
    df.columns = ['answer', 'phrase']
    df['answer_id'] = df['answer'].factorize()[0]
    answer_id_df = df[['answer', 'answer_id']].drop_duplicates().sort_values('answer_id')
    answer_to_id = dict(answer_id_df.values)
    id_to_answer = dict(answer_id_df[['answer_id', 'answer']].values)


def train(word):
    """
        fitting the training model to multinomial naive bayes classifier and obtaining the final output according
        to the word
        :param word: word that needs to be classified
        :return: Classified_Output
    """

    X_train, X_test, y_train, y_test = train_test_split(df['phrase'], df['answer'], random_state = 0)
    count_vect = CountVectorizer()
    X_train_counts = count_vect.fit_transform(X_train)
    tfidf_transformer = TfidfTransformer()
    X_train_tfidf = tfidf_transformer.fit_transform(X_train_counts)

    # fitting the training model to multinomial naive bayes classifier
    clf = MultinomialNB().fit(X_train_tfidf, y_train)

    Classified_Output = (clf.predict(count_vect.transform([word]))[0])

    return Classified_Output