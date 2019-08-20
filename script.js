const colors = [
  'rgba(244,67,54,1)',
  'rgba(156,39,176,1)',
  'rgba(33,150,243,1)',
  'rgba(0,150,136,1)',
  'rgba(76,175,80,1)',
  'rgba(255,152,0,1)',
  'rgba(121,85,72,1)',
];

function doChart(data, type, title) {
  const labels = data.map(week => week.name);
  const datasets = [];

  data.forEach((week, weekIndex) => {
    week.table.forEach((w, i) => {
      if (weekIndex === 0) {
        datasets.push({
          label: w.person,
          data: [],
          borderColor: colors[i],
          backgroundColor: 'rgba(255,255,255,0)'
        });
      }

      const point = datasets.find(p => p.label === w.person);
      point.data.push(w[type]);
    });
  });

  const ctx = document.getElementById(`${type}-chart`).getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets
    },
    options: {
      title: {
        display: true,
        text: title
      },
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
      valueGetter: params => params.node.rowIndex + 1,
      resizable: true
    },
    {
      headerName: "Player",
      field: "person",
      resizable: true
    },
    {
      headerName: "Team",
      field: "team",
      resizable: true
    },
    {
      headerName: "Points",
      field: "points",
      resizable: true
    },
    {
      headerName: "Overall Rank",
      field: "overall",
      resizable: true
    },
    {
      headerName: "Transfers In",
      field: "transfersIn",
      resizable: true,
      valueFormatter: node => node.value.join(', ')
    },
    {
      headerName: "Transfers Out",
      field: "transfersOut",
      resizable: true,
      valueFormatter: node => node.value.join(', ')
    }
  ];

  const rowData = data[defaultWeek].table;
  const gridOptions = {
    columnDefs,
    rowData,
    onGridReady: params => params.api.sizeColumnsToFit()
  };

  const grid = new agGrid.Grid(document.querySelector("#grid"), gridOptions);

  document.querySelectorAll(".option").forEach(option => {
    const { value } = option;
    const index = parseInt(value);

    if (!data[index]) {
      option.disabled = true;
    }

    if (index === defaultWeek) {
      option.selected = true;
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

  doChart(data, 'points', 'Points (Higher is Better)');
  doChart(data, 'overall', 'Overall Rank (Lower is Better)');
  doAgGrid(data);
}

fetch("https://raw.githubusercontent.com/lewell94/fpl/master/fpl.json")
  .then(res => res.json())
  .then(load);
