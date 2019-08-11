const colors = [
  'rgba(244,67,54,1)',
  'rgba(156,39,176,1)',
  'rgba(33,150,243,1)',
  'rgba(0,150,136,1)',
  'rgba(76,175,80,1)',
  'rgba(255,152,0,1)',
  'rgba(121,85,72,1)',
];

function doChart(data) {
  const labels = data.map(week => week.name);
  const datasets = [];

  data.forEach((week, weekIndex) => {
    week.table.forEach((w, i) => {
      if (weekIndex === 0) {
        datasets.push({
          label: w.person,
          data: [],
          backgroundColor: colors[i]
        });
      }

      const point = datasets.find(p => p.label === w.person);
      point.data.push(w.points);
    });
  });

  const ctx = document.getElementById("chart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
}

function doAgGrid(data) {
  const defaultWeek = data.length - 1;
  const columnDefs = [
    {
      headerName: "Position",
      valueGetter: params => params.node.rowIndex + 1
    },
    {
      headerName: "Player",
      field: "person"
    },
    {
      headerName: "Team",
      field: "team"
    },
    {
      headerName: "Points",
      field: "points"
    }
  ];

  const rowData = data[defaultWeek].table;
  const gridOptions = {
    columnDefs,
    rowData
  };

  const grid = new agGrid.Grid(document.querySelector("#grid"), gridOptions);

  document.querySelectorAll(".option").forEach(option => {
    const { value } = option;
    const index = parseInt(value);

    if (!data[index]) {
      option.disabled = true;
    }
  });

  document.querySelector("#select").addEventListener("change", e => {
    const { value } = e.target;

    grid.gridOptions.api.setRowData(data[value].table);
  });
}

function load(data) {
  if (!agGrid || !Chart) {
    alert(":( Please refresh the page");
    return;
  }

  doChart(data);
  doAgGrid(data);
}

fetch("https://bitbucket.org/lewell94/fpl/raw/a9c5086295b2c799a256f97be39218d588224fa9/fpl.json")
  .then(res => res.json())
  .then(load);
