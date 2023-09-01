from init import model
import sys, json
import pandas as pd

# train the NN model

def main():
    courses_df = pd.DataFrame(json.loads(sys.argv[1]))
    grades_df = pd.DataFrame(json.loads(sys.argv[2]))

    # add verbose when testing
    model.fit(courses_df, grades_df, epochs=10, verbose=0)

    # model.evaluate('input', 'grade')

    # predict the grade and flush
    df = pd.DataFrame([sys.argv[3]])
    # print(temp, file=sys.stderr)

    # add verbose when testing
    [[grade_predicted]] = model.predict(df, verbose=0)
    print(grade_predicted, file=sys.stderr)
    print(grade_predicted)

if __name__ == "__main__":
    main()
