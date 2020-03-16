
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
function buildMetadata(sample) {
  
  d3.json(`/metadata/${sample}`).then((data) =>{
    // Use d3 to select the panel with id of `#sample-metadata`
      var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
      panel.html("")
    // Use `Object.entries` to add each key and value pair to the panel
      Object.entries(data).forEach(([key,value])=>{
        panel.append("h5").text(`${key}:${value}`)
      })

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data)=>{
    // @TODO: Build a Bubble Chart using the sample data
    const otu_ids = data.otu_ids
    const otu_labels = data.otu_labels
    const sample_values = data.sample_values
    
    let bubbleLayout = {
      margin:{t:15},
      xaxis:{title:"OTU ID"}
    }
   
    let bubbleData = [{
      x:otu_ids,
      y:sample_values,
      text: otu_labels,
      mode:"markers",
      marker: {
        size: sample_values,
        color: otu_ids,
      }
    }
    ]
    Plotly.plot("bubble", bubbleData, bubbleLayout);
       // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    let pieData = [
      {
        values:sample_values.sort((a,b)=> b-a).slice(0,10),
        labels:otu_ids,
        hovertext: otu_labels,
        type: "pie",
        hoverinfo: "hovertext"
      }
    ]
    let pieLayout = {
      margin: { t: 0, l: 0 }
    };
    Plotly.plot("pie",pieData, pieLayout)
  })
}
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
