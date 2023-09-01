import sys, json
import pandas as pd
import matplotlib.pyplot as plt

def main():
    # print(sys.argv[1], file=sys.stderr)
    grades_df = pd.DataFrame(json.loads(sys.argv[1]))
              
    # print(courses_df, grades_df, file=sys.stderr)

    # create boxplot of grades for class
    if (sys.argv[2] == 'boxplot'):
        fig = grades_df.plot.box(figsize=(8, 6))
        fig.set_title(f"Boxplot of Grades for {sys.argv[3]}")
        fig.set_ylabel(f"Grade")
        fig.get_xaxis().set_visible(False)
        
    # create histogram of grades for class
    elif (sys.argv[2] == 'histogram'):
        fig = grades_df.plot.hist(figsize=(8, 6))
        fig.set_title(f"Relative Frequency Distribution of Grades for {sys.argv[3]}")
        fig.set_xlabel(f"Grade")
        fig.set_ylabel(f"Relative Frequency")
        fig.get_legend().set_visible(False)
    
    fig.figure.savefig('graph.png')

if __name__ == "__main__":
    main()
