package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

// For time parsing
type CustomTime struct {
	time.Time
}

// Fix DateTime error value
func (ct *CustomTime) UnmarshalJSON(b []byte) error {
	str := string(b)
	// Trim quotes, if any
	str = str[1 : len(str)-1]

	// If the string is empty, set a default value
	if str == "" {
		defaultValue := "2031-01-01T00:00:00Z"
		t, err := time.Parse(time.RFC3339, defaultValue)
		if err != nil {
			return err
		}
		ct.Time = t
		return nil
	}

	t, err := time.Parse("2006-01-02 15:04", str)
	if err != nil {
		return err
	}
	ct.Time = t
	return nil
}

// Feature structure form json
type Feature struct {
	Id             int        `json:"id"`
	DisplayName    string     `json:"displayName"`
	Name           string     `json:"technicalName"`
	ExpirationDate CustomTime `json:"expiresOn"`
	Description    string     `json:"description"`
	Inverted       bool       `json:"inverted"`
	CustomerList   []string   `json:"customerIds"`
	Archived       bool       `json:"archived"`
}

// Request structure from example
type FeatureRequest struct {
	CustomerID string    `json:"customerId"`
	Features   []Feature `json:"features"`
}

// Response structure
type FeatureResponse struct {
	Features []FeatureResult `json:"features"`
}

// Individual response line
type FeatureResult struct {
	Name     string `json:"name"`
	Active   bool   `json:"active"`
	Inverted bool   `json:"inverted"`
	Expired  bool   `json:"expired"`
}

// Get features
func HandleFeatureRequest(w http.ResponseWriter, r *http.Request) {

	customerIDinp := os.Args[1]

	// Fetch features from external API endpoint
	features, err := fetchFeaturesFromAPI("http://localhost:3000/features")
	if err != nil {
		http.Error(w, "Error fetching features from API", http.StatusInternalServerError)
		return
	}

	// Check if the request body is empty
	if r.Body == nil {
		http.Error(w, "Request body is empty", http.StatusBadRequest)
		return
	}

	if err != nil {
		if err.Error() == "EOF" {
			http.Error(w, "Request body is empty", http.StatusBadRequest)
			return
		}
		http.Error(w, "Error decoding JSON", http.StatusBadRequest)
		return
	}

	// Process features and create the response
	var featureResponse FeatureResponse
	for _, feature := range features {

		expired := false
		if feature.ExpirationDate.Before(time.Now()) {
			expired = true
		}

		active := true
		if feature.Inverted || expired || feature.Archived {
			active = false
		} else {
			active = true
		}

		// TODO: not working
		// define comment ferore feture in JSON
		comment := ""
		fmt.Println("before for")
		for i := 0; i < len(feature.CustomerList); i++ {
			fmt.Println("For loop", comment)
			switch {
			case feature.CustomerList[i] == customerIDinp && feature.Inverted && expired:
				comment = "// customer is in the list of the feature toggle, but toggle is inverted and expired:"
				fmt.Println("The value of inner is", 1)
			case feature.CustomerList[i] == customerIDinp && feature.Inverted && !expired:
				fmt.Println("The value of inner is", 2)
				comment = "// customer is in the list of the feature toggle, but toggle is inverted:"
				fmt.Println("The value of inner is", 3)
			case feature.CustomerList[i] == customerIDinp && !feature.Inverted && expired:
				fmt.Println("The value of inner is", 4)
				comment = "// customer is in the list of the feature toggle, but toggle is expired:"
			case feature.CustomerList[i] == customerIDinp && !feature.Inverted && !expired:
				fmt.Println("The value of inner is", 5)
				comment = "// customer is in the list of the feature toggle:"
			case feature.CustomerList[i] != customerIDinp && feature.Inverted && expired:
				fmt.Println("The value of inner is", 6)
				comment = "// customer is NOT in the list of the feature, but feature toggle is inverted and expired:"
			case feature.CustomerList[i] != customerIDinp && feature.Inverted && !expired:
				fmt.Println("The value of inner is", 7)
				comment = "// customer is NOT in the list of the feature, but feature toggle is inverted:"
			case feature.CustomerList[i] != customerIDinp && !feature.Inverted && expired:
				fmt.Println("The value of inner is", 8)
				comment = "// customer is NOT in the list of the feature, but feature toggle is expired:"
			case feature.CustomerList[i] != customerIDinp && !feature.Inverted && !expired:
				fmt.Println("The value of inner is", 9)
				comment = "// customer is NOT in the list of the feature:"
			default:
				comment = "// Unchecked option"
				fmt.Println("The value of inner is", 10)
			}
		}

		featureResponse.Features = append(featureResponse.Features, FeatureResult{
			Name:     feature.Name,
			Active:   active,
			Inverted: feature.Inverted,
			Expired:  expired,
		})
	}

	// Convert response to JSON
	responseJSON, err := json.Marshal(featureResponse)
	if err != nil {
		http.Error(w, "Error marshaling JSON", http.StatusInternalServerError)
		return
	}

	// Set response headers
	w.Header().Set("Content-Type", "application/json")

	// Send the JSON response
	w.Write(responseJSON)
}

// Get all features
func fetchFeaturesFromAPI(apiURL string) ([]Feature, error) {
	response, err := http.Get(apiURL)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	var features []Feature
	err = json.NewDecoder(response.Body).Decode(&features)
	if err != nil {
		return nil, err
	}

	return features, nil
}

func main() {
	customerIDinp := os.Args[1]
	// Define the route for handling feature requests
	http.HandleFunc("/featureRequest", HandleFeatureRequest)

	// Start the server on port 8080
	fmt.Println("Server is running on :8080 for clientID\n", customerIDinp)
	http.ListenAndServe(":8080", nil)
}
