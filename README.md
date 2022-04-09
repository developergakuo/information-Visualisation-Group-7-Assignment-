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
3. Remove unneccessary columns, take care of N/A or NaN data values, ensure the data entered in the required data format

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

# Sample visualisations
https://datavizproject.com/


