# Implementasi Algoritma UCS dan A* untuk Menentukan Lintasan Terpendek

https://user-images.githubusercontent.com/86491005/231467534-7dbd4e50-ee3c-4f35-b61e-136d99c34f7b.mp4

Algoritma UCS (Uniform cost search) dan A* (atau A star) dapat digunakan untuk menentukan lintasan terpendek dari suatu titik ke titik lain. Pada tugas kecil 3 ini, anda diminta menentukan lintasan terpendek berdasarkan peta Google Map jalan-jalan di kota Bandung. Dari ruas-ruas jalan di peta dibentuk graf. Simpul menyatakan persilangan jalan (simpang 3, 4 atau 5) atau ujung jalan. Asumsikan jalan dapat dilalui dari dua arah. Bobot graf menyatakan jarak (m atau km) antar simpul. Jarak antar dua simpul dapat dihitung dari koordinat kedua simpul menggunakan rumus jarak Euclidean (berdasarkan koordinat) atau dapat menggunakan ruler di Google Map, atau cara lainnya yang disediakan oleh Google Map.

## Group Members
| NIM      | Name                        | Tugas                                   |
| -------- | --------------------------- |-----------------------------------------|
| 13521092 | Frankie Huang               | API, I/O, Website                       |
| 13521104 | Muhammad Zaydan A           | A* algorithm, UCS algorithm             |

## About this project
- Solves shortest path problem with either Uniform Cost Search algorithm or A* algorithm.
- Website implemented using the Bootstrap framework
- Place the nodes either by clicking the map or using predefined file
- Programmed and implemented in JavaScript

## Features

The features below are 100% done and implemented.
- Uniform Cost Search algorithm solution
- A* algorithm solution
- Uses Haversine formula to calculate distance
- A professional looking website made for simplicity

## Requirements
No extra packages are needed to run this website locally

## Setup
Firstly, clone this repository.
```bash
git git@github.com:zaydanA/Tucil3_13521092_13521104.git
```

Then you can run the `index.html` file provided in the `src` folder using your browser of choice.
```bash
firefox src/index.html
```

You can also run this project from this [link](https://zafrank-shortest-path.vercel.app/).

## Program Structure

```
├── src
│   ├── about.html
│   ├── algorithm.js
│   ├── assets
│   │   ├── brand
│   │   │   ├── bootstrap-logo.svg
│   │   │   └── bootstrap-logo-white.svg
│   │   ├── display.png
│   │   ├── dist
│   │   │   ├── css
│   │   │   │   ├── bootstrap.min.css
│   │   │   │   ├── bootstrap.min.css.map
│   │   │   │   ├── bootstrap.rtl.min.css
│   │   │   │   └── bootstrap.rtl.min.css.map
│   │   │   └── js
│   │   │       ├── bootstrap.bundle.min.js
│   │   │       └── bootstrap.bundle.min.js.map
│   │   └── logo.png
│   ├── index.html
│   ├── index.js
│   ├── maps.html
│   └── style.css
├── test
│   ├── TC-1.txt
│   ├── TC-2.txt
│   ├── TC-3.txt
│   └── TC-4.txt
└── README.md
```

## Project Status
This project is *finished*.

*There are no plans to change, add, or optimize the program in the near future.*

## Room for Improvement
- More efficient UCS and A* algorithm

## Acknowledgements
- This project is spearheaded by the IF2211 Informatics major at Institut Teknologi Bandung, which has been well organized by the IF2211 - 2023 professors and assistants.
- README template by [@flynerdpl](https://www.flynerd.pl/): [README](https://github.com/ritaly/README-cheatsheet)
- Thanks to the reference sources and methods as a basis that have been listed in the relevant parts of the report.
