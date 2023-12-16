import React, { useState, useRef, useEffect } from "react";
import "vis/dist/vis.css";
import vis from "vis";

function App() {
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [nodeDataSet, setNodeDataSet] = useState(null);
  const [edgeDataSet, setEdgeDataSet] = useState(null);
  const visJsRef = useRef(null);
 

  useEffect(() => {
    if (nodeDataSet && edgeDataSet) {
      const options = {
        autoResize: true,
        manipulation: {
          enabled: true,
          addNode: function (data, callback) {
            data.label = prompt("Enter node label");
            callback(data);
          },
    
        },
        physics: {
          enabled: true
        },
        edges: {
          smooth: true
        },
        layout: {
          hierarchical: false
        },
        autoResize: true,
        interaction: {
          dragNodes: true,
          dragView: true,
          zoomView: true
        }

        
      };

      const network = new vis.Network(
        visJsRef.current,
        { nodes: nodeDataSet, edges: edgeDataSet },
        options
      );

      // Disable automatic graph redraw
      network.setOptions({
        manipulation: {
          enabled: true
        },
        physics: {
          enabled: true
        },
        edges: {
          smooth: true
        },
        layout: {
          hierarchical: false
        },
        autoResize: true,
        interaction: {
          dragNodes: true,
          dragView: true,
          zoomView: true
        },
        configure: false
      });
    }
  }, [visJsRef, nodeDataSet, edgeDataSet]);



  function handleSubmit(e) {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = function (event) {
      const contents = event.target.result;
      const data = JSON.parse(contents);
      setJsonData(data);
    };
    reader.readAsText(file);
  }
  <form onSubmit={handleAddNode}>
    <label htmlFor="newNodeName">New Node Name:</label>
    <input type="text" id="newNodeName" />
    <button type="submit">Add Node</button>
  </form>
  function handleClear(e) {
    e.preventDefault();
    window.location.reload();
  }

  function handleAddNode() {
    const newNodeLabel = prompt("Enter node label"); // Prompt user for node label
    if (newNodeLabel) { // If user entered a label, add the new node
      const node = { id: Date.now(), label: newNodeLabel };
      nodeDataSet.add(node);
      visJsRef.current.network.redraw();
    }
  }





  function handleAddEdge() {
    const nodes = nodeDataSet.get({
      fields: ["id"],
    });

    if (nodes.length >= 2) {
      const fromNodeId = nodes[0].id;
      const toNodeId = nodes[1].id;
      const edge = { id: Date.now(), from: fromNodeId, to: toNodeId };
      edgeDataSet.add(edge);

      const updatedJsonData = {
        nodes: nodeDataSet.get(),
        edges: edgeDataSet.get(),
      };
      setJsonData(updatedJsonData);
      console.log(updatedJsonData)
    }
  }

  useEffect(() => {
    console.log(jsonData)
    if (jsonData) {
      const nodes = new vis.DataSet(jsonData.nodes);
      const edges = new vis.DataSet(jsonData.edges);
      setNodeDataSet(nodes);
      setEdgeDataSet(edges);
    }
  }, [jsonData]);

  return (
    <>
      <div class="example">
        <form >
          <label htmlFor="jsonFile" style={{ color: "violet", font: "100px", height: "200px", width: "20px" }}>
            Select a JSON file:
          </label>


          <input
            type="file"
            id="jsonFile"
            accept=".json"
            onChange={(event) => {
              setFile(event.target.files[0]);
            }}
          />
          <button
            style={{ backgroundColor: "violet", border:"white",color:"white",padding:"1px 32px",textAlign:"center",display:"inline-block", fontSize: "16px", color: "white", position:"fixed", left:"300px"}}
            onClick={handleSubmit}
          >
            Submit
          </button>


          <button style={{backgroundColor: "violet", border:"white",color:"white",padding:"1px 32px",textAlign:"center",display:"inline-block", fontSize: "16px", color: "white", margin:"0px 10px",position:"fixed", left:"430px" }}onClick={handleClear}>clear</button>

        </form>
        <div
          style={{
            display: "flex",
          }}
        >


          <div
            id="network"
            ref={visJsRef}
            style={{
              height: "100vh",
              width: "150vh",
            }}
          ></div>
          {jsonData && (
            <table className="my-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                </tr>
              </thead>
              <tbody>
                {
                  jsonData.edges.map((index) => {
                    return (
                      <tr key={index.form}>
                        <td>{index.from}</td>
                        <td>{index.to}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>


          )
          }
        </div>
      </div>
    </>
  );
}


export default App;
