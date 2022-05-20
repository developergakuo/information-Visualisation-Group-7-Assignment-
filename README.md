# Instructions to run the visualisation react application 
### dependencies - React.js, Node (npm) (You might need to install these dependencies)

1. clone this repository 
2. add the directory `processed_data` to the directory `stack-overflow-visualisation-group-7/public` : data can be found here -> https://drive.google.com/drive/folders/15S9O6Qa269QagjIi_4ECM-KyTe5EF5tj?usp=sharing
3. start a console from the directory `stack-overflow-visualisation-group-7`
4. run the command `npm install` to install all the node modules for the app 
5. run the command `npm start` to start the app (This opens the browser with the app running on there)






# Information-Visualisation-Group-7-Assignment

## Datasets for visualisation
The datasets can be found here 
https://insights.stackoverflow.com/survey?_ga=2.93265432.465840662.1648566697-1822023714.1648566697

#  Preprocesssing ideas
### Patrick's ideas 

1. Convert all provided salaries (CompTotal) to a common currency (Currency) and scale it to the same payment frequency (CompFreq)
2. Compute sets of tools used together eg (langauge, IDE, Database, framework)
   - For each user collect a set of tools they use
   - Compute popular sets 

//patrick aren't we just suppose to clean the dataset at the preprocessing step? At least based from the lectures/WPO, 
that is what is mentionned.....
3. Remove unneccessary columns, take care of N/A or NaN data values, ensure the data entered is in the required data format....

# Visualisation ideas 
### Patrick's ideas
1. Compare profession (DevType) type to income
2. Compare years of coding to income. (YearsCodePro, YearsCode) - What is the contribution of experience to income?
3. Check the average number of languages used by a developer (LanguageHaveWorkedWith)
4.  Compare trends over the years (income, language popularity, average age of developers)

### Louise's ideas
1. Visualise developer location information on an actual map 
   * Number of delevolpers who participated in the survey per country 
   * Average income per country (or per profession per country)
   * Levels of education per country

### Aubin's ideas 
1. Compute the most popular language (eg per profession? ).  (LanguageHaveWorkedWith, LanguageWantToWorkWith)
  -  Allow visualisations to zoom years in and out - see this example https://www.xe.com/currencycharts/?from=RUB&to=EUR&view=10Y
3. Visuase the most popular frameworks, tools, databases, IDEs, OS, cloud frameworks, web frameworks 
4. Visualise popular sets of tools (tool stack)
5. Interactive Visualision on a map (D3.js (Patrick and louise), plotly/tableau/plotly express(Aubin))

#### Thomas's ideas
1. Visualise for each country the must use language by developer (The must popular language by country)
2. The minimum salary and maximum salary for developers who use the(se) language(s)
3. Visualise the must use sets of tools for the corresponding language (IDE, Database, framework)


# Sample visualisations
https://datavizproject.com/


