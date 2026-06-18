const {chromium } = require('playwright');
const fs = require('fs');

// Data from serpapi response for "Technology companies in delhi" query on google maps

// getJson({
//   engine: "google_maps",
//   q: query,
//   ll: "@40.7455096,-74.0083012,14z",
//   api_key: ,
// }, (json) => {

//   data = json["local_results"];
// });

const data = {
  "search_metadata": {
    "id": "6a27af30974bbb28825584d1",
    "status": "Success",
    "json_endpoint": "https://serpapi.com/searches/KGa4kIOusxpniGzYVhBe8Q/6a27af30974bbb28825584d1.json",
    "created_at": "2026-06-09 06:14:08 UTC",
    "processed_at": "2026-06-09 06:14:08 UTC",
    "google_maps_url": "https://www.google.com/maps/search/Technology+companies+in+delhi/@40.7455096,-74.0083012,14z/?hl=en",
    "raw_html_file": "https://serpapi.com/searches/KGa4kIOusxpniGzYVhBe8Q/6a27af30974bbb28825584d1.html",
    "prettify_html_file": "https://serpapi.com/searches/KGa4kIOusxpniGzYVhBe8Q/6a27af30974bbb28825584d1.prettify",
    "total_time_taken": 0.53
  },
  "search_parameters": {
    "engine": "google_maps",
    "type": "search",
    "q": "Technology companies in delhi",
    "ll": "@40.7455096,-74.0083012,14z",
    "google_domain": "google.com",
    "hl": "en"
  },
  "search_information": {
    "local_results_state": "Results for exact spelling",
    "query_displayed": "Technology companies in delhi"
  },
  "local_results": [
    {
      "position": 1,
      "title": "Appinventiv Technology Pvt. Ltd",
      "place_id": "ChIJRc-xt6dZwokRH9kbVxtf2hc",
      "data_id": "0x89c259a7b7b1cf45:0x17da5f1b571bd91f",
      "data_cid": "1718790778825464095",
      "reviews_link": "https://serpapi.com/search.json?data_id=0x89c259a7b7b1cf45%3A0x17da5f1b571bd91f&engine=google_maps_reviews&hl=en",
      "photos_link": "https://serpapi.com/search.json?data_id=0x89c259a7b7b1cf45%3A0x17da5f1b571bd91f&engine=google_maps_photos&hl=en",
      "gps_coordinates": {
        "latitude": 40.744075699999996,
        "longitude": -73.98519759999999
      },
      "place_id_search": "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJRc-xt6dZwokRH9kbVxtf2hc",
      "provider_id": "/g/11bwk_6_vg",
      "rating": 3.9,
      "reviews": 12,
      "type": "Software company",
      "types": [
        "Software company"
      ],
      "type_id": "software_company",
      "type_ids": [
        "software_company"
      ],
      "address": "79 Madison Ave, New York, NY 10001",
      "country": "United States",
      "open_state": "Open 24 hours",
      "hours": "Open 24 hours",
      "operating_hours": {
        "tuesday": "Open 24 hours",
        "wednesday": "Open 24 hours",
        "thursday": "Open 24 hours",
        "friday": "Open 24 hours",
        "saturday": "Open 24 hours",
        "sunday": "Open 24 hours",
        "monday": "Open 24 hours"
      },
      "phone": "(404) 563-1172",
      "website": "https://appinventiv.com/",
      "user_review": "\"The Best App Development Company to work with.\"",
      "thumbnail": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFewwmlVA9rALhK3Ct-YSHC7IMysXzgMfBjgwLk4s4VUdZuIOdQbOkspgY2WwGXGNFuoitF1GVN62qM_csRhSGpyRCFG3E3CMIQa12O7omHP-mepqw9ek8hVQzSt5kCCJr8TAI=w1000-h1000-c-n",
      "serpapi_thumbnail": "https://serpapi.com/images/url/KMGh4HicHcTbboIwGADgJ6qcPC7ZRW2k4gQENtTdLFutrSvQyl_S6AP6Dr7Nkn0X3_MhrTXw4nmNjEZCa9HwAXjPdGd5Z0dMt54wgBgg8PAuKxSOuXNtU-NFj7fyLSIWHas1mSXpDQ53kZ6Xv8Jt1RjG9cfpc0jyU_GTKzDiGO4dPdAsHvTFxgGts2l4Tb8YlLKi5laSmEariKRJ8R2E-Uy36x1qubm6BVdzWRf3yk4UIZt-_o6TVxf4vo_k_wx1fzG2RBg"
    },
    {
      "position": 2,
      "title": "US Tech Solutions, Inc.",
      "place_id": "ChIJR-4Y1ObHxokRavsXEefgexg",
      "data_id": "0x89c6c7e6d418ee47:0x187be0e71117fb6a",
      "data_cid": "1764250962074532714",
      "reviews_link": "https://serpapi.com/search.json?data_id=0x89c6c7e6d418ee47%3A0x187be0e71117fb6a&engine=google_maps_reviews&hl=en",
      "photos_link": "https://serpapi.com/search.json?data_id=0x89c6c7e6d418ee47%3A0x187be0e71117fb6a&engine=google_maps_photos&hl=en",
      "gps_coordinates": {
        "latitude": 40.716651,
        "longitude": -74.03330079999999
      },
      "place_id_search": "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJR-4Y1ObHxokRavsXEefgexg",
      "provider_id": "/g/11g1w4x37r",
      "rating": 4.8,
      "reviews": 519,
      "type": "Recruiter",
      "types": [
        "Recruiter",
        "Business management consultant",
        "Computer security service",
        "Computer support and services",
        "Human resource consulting"
      ],
      "type_id": "recruiter",
      "type_ids": [
        "recruiter",
        "business_management_consultant",
        "computer_security_service",
        "computer_support_and_services",
        "human_ressource_consulting"
      ],
      "address": "10 Exchange Pl, Jersey City, NJ 07302",
      "country": "United States",
      "open_state": "Closed · Opens 9 AM",
      "hours": "Closed · Opens 9 AM",
      "operating_hours": {
        "tuesday": "9 AM–5 PM",
        "wednesday": "9 AM–5 PM",
        "thursday": "9 AM–5 PM",
        "friday": "9 AM–5 PM",
        "saturday": "Closed",
        "sunday": "Closed",
        "monday": "9 AM–5 PM"
      },
      "phone": "(201) 524-9600",
      "website": "http://www.ustechsolutions.com/",
      "extensions": [
        {
          "from_the_business": [
            "Identifies as Asian-owned"
          ]
        },
        {
          "accessibility": [
            "Wheelchair accessible entrance",
            "Wheelchair accessible restroom",
            "Wheelchair accessible seating"
          ]
        },
        {
          "planning": [
            "Appointment required"
          ]
        }
      ],
      "user_review": "\"I had the pleasure of working with Rashi from US tech solutions.\"",
      "thumbnail": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEODRuVGFaQ0RTDZ-zN9VaE9X4frsdLikb1GWU3S8_fBsMLZSRGYX85iKCpvPIY32L1cdRkorD4nBhmsqkL3PhsBlX6XkZoAJADTKu6_yvsq2HuEXntQXFMK16OqgjRhjVYkm0l=w1000-h1000-c-n",
      "serpapi_thumbnail": "https://serpapi.com/images/url/Ho4kNXicHcRRboIwGADgE1WKKFETH0CQbaBCUSy8GK1ItdACf9FsF9wZdpslfg_f3y_XuoWFYdTcGlVKVXU5QNkzJXUp9YipxqhaQAwQGE68TYTj7zwyZMH6nGCy9wr0s51nZ39OJ7certFdXMzgeLDS2enmwiYqUhLkdDa9h6v2GX_m1jgy2ZUI1XsT6fIGOhFZMQe3pjYVhXK-HG8fDvbp-wnd-GPwqdQJXW9C09511YPwR5aLBtfLl4kxRvw9Q_If72NEFw"
    },
    {
      "position": 3,
      "title": "Mobikasa",
      "place_id": "ChIJzTy8FglZwokRso2aWbiL4hE",
      "data_id": "0x89c2590916bc3ccd:0x11e28bb8599a8db2",
      "data_cid": "1288746067274927538",
      "reviews_link": "https://serpapi.com/search.json?data_id=0x89c2590916bc3ccd%3A0x11e28bb8599a8db2&engine=google_maps_reviews&hl=en",
      "photos_link": "https://serpapi.com/search.json?data_id=0x89c2590916bc3ccd%3A0x11e28bb8599a8db2&engine=google_maps_photos&hl=en",
      "gps_coordinates": {
        "latitude": 40.7460199,
        "longitude": -73.9840092
      },
      "place_id_search": "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJzTy8FglZwokRso2aWbiL4hE",
      "provider_id": "/g/1td_cltl",
      "rating": 4.9,
      "reviews": 42,
      "type": "E commerce agency",
      "types": [
        "E commerce agency",
        "Internet marketing service",
        "Software company",
        "Website designer"
      ],
      "type_id": "e_commerce_agency",
      "type_ids": [
        "e_commerce_agency",
        "internet_marketing_service",
        "software_company",
        "website_designer"
      ],
      "address": "135 Madison Ave 8th FL, New York, NY 10016",
      "country": "United States",
      "open_state": "Closed · Opens 9 AM",
      "hours": "Closed · Opens 9 AM",
      "operating_hours": {
        "tuesday": "9 AM–7 PM",
        "wednesday": "9 AM–7 PM",
        "thursday": "9 AM–7 PM",
        "friday": "9 AM–7 PM",
        "saturday": "9 AM–7 PM",
        "sunday": "Closed",
        "monday": "9 AM–7 PM"
      },
      "phone": "(646) 880-4504",
      "website": "http://www.mobikasa.com/?utm_source=google&utm_medium=organic&utm_campaign=google_business_listing",
      "extensions": [
        {
          "service_options": [
            "Online appointments",
            "Onsite services"
          ]
        },
        {
          "accessibility": [
            "Wheelchair accessible entrance",
            "Wheelchair accessible restroom",
            "Wheelchair accessible seating"
          ]
        },
        {
          "planning": [
            "Appointment required"
          ]
        }
      ],
      "service_options": {
        "online_appointments": true,
        "onsite_services": true
      },
      "user_review": "\"Best company in IT field\"",
      "thumbnail": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHisAl7HJLfMpE2NgKrir2IcFgs1--X3Gruf3TX8yrl1q0VfKmz0F8Ygn2FIQc5_2qPyw9Fl42ruwMnwv_rezRfnWEos6_jMeJPx90KY0ulrQkQX0MBZl4JCbX1Zuv8TkUZNm_6=w1000-h1000-c-n",
      "serpapi_thumbnail": "https://serpapi.com/images/url/P4pGdHicHcRdDoIgAADgE5GIZtbWg7XMNJ22fswXtxhiiWAgWV2wM3Sbtr6H7_up-75TM8NgtTWiQlBGtCISC94T3o-waA3aKYAVUIaXJlnjBVflsUkQbqu4W6GERvIq0Qb7VJkA5NZa6sra5-5LMvMOj1XUvqHvnilH_ibD4xLd09cw9ZmNpB5iPjxKSd67ip9WQjnlLSZh-pzC6Aw1k1mT5TBeFMwOl5fcLPTD3TeHImlLZz6YEEJQ_8eA_wBHZUSc"
    },
    {
      "position": 4,
      "title": "Queppelin - A Metaverse Development Company",
      "place_id": "ChIJ23pFr9dZwokR-0HWsWrAg0o",
      "data_id": "0x89c259d7af457adb:0x4a83c06ab1d641fb",
      "data_cid": "5369346745238438395",
      "reviews_link": "https://serpapi.com/search.json?data_id=0x89c259d7af457adb%3A0x4a83c06ab1d641fb&engine=google_maps_reviews&hl=en",
      "photos_link": "https://serpapi.com/search.json?data_id=0x89c259d7af457adb%3A0x4a83c06ab1d641fb&engine=google_maps_photos&hl=en",
      "gps_coordinates": {
        "latitude": 40.7501409,
        "longitude": -73.9814937
      },
      "place_id_search": "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJ23pFr9dZwokR-0HWsWrAg0o",
      "provider_id": "/g/11t4gh7cm1",
      "rating": 3.7,
      "reviews": 3,
      "type": "Software company",
      "types": [
        "Software company"
      ],
      "type_id": "software_company",
      "type_ids": [
        "software_company"
      ],
      "address": "244 Madison Ave #1191, New York, NY 10016",
      "country": "United States",
      "open_state": "Closed · Opens 8 AM",
      "hours": "Closed · Opens 8 AM",
      "operating_hours": {
        "tuesday": "8 AM–6 PM",
        "wednesday": "8 AM–6 PM",
        "thursday": "8 AM–6 PM",
        "friday": "8 AM–6 PM",
        "saturday": "Closed",
        "sunday": "Closed",
        "monday": "8 AM–6 PM"
      },
      "phone": "(562) 353-5670",
      "website": "https://www.queppelin.com/",
      "extensions": [
        {
          "accessibility": [
            "Wheelchair accessible entrance"
          ]
        },
        {
          "parking": [
            "Paid street parking"
          ]
        }
      ],
      "user_review": "\"We opted for the Blockchain Development Services from Queppelin.\"",
      "thumbnail": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEZWyefCPgUxvEDQp79_uA6tyRwcHl6n8pKbkqmfksMdrp268axwRR81haQYiZfriefAox8zOA2Shlvknzbus2DKbggUcv9-K3v2XYqYA7FPMy84biG_WYVY8TxIL4AB8ahvpQ=w1000-h1000-c-n",
      "serpapi_thumbnail": "https://serpapi.com/images/url/NnPnpnicHcTbToMwAADQL-pgjEBn4kPdRQ2igDLWvSxQS0tgbUdLuXyg_-DfmHgezu8PN0bpB8fp-GbFpGQdHTTtiRSGCrMi8uYwpQHRQDsoeU9bdLgUM613Ccsne9inKtxeBxSYORvJSxcIqKKqvd_qVsffvfICWE5jlsE1L1PcXOq-oTWSE1w-kPfJO9uKpRq0t48qxnJityDaWO-M7xiFxySeoV81z9cCnzD8ml7ffPQES25V-jiuXdcF_H8CxB--z0WW"
    },
    {
      "position": 5,
      "title": "E-SUTRA Technologies Private Limited",
      "place_id": "ChIJi46GQ4ABDTkRzdjqFLQ-Hts",
      "data_id": "0x390d018043868e8b:0xdb1e3eb414ead8cd",
      "data_cid": "15789126286773508301",
      "reviews_link": "https://serpapi.com/search.json?data_id=0x390d018043868e8b%3A0xdb1e3eb414ead8cd&engine=google_maps_reviews&hl=en",
      "photos_link": "https://serpapi.com/search.json?data_id=0x390d018043868e8b%3A0xdb1e3eb414ead8cd&engine=google_maps_photos&hl=en",
      "gps_coordinates": {
        "latitude": 28.6905841,
        "longitude": 77.1517968
      },
      "place_id_search": "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJi46GQ4ABDTkRzdjqFLQ-Hts",
      "provider_id": "/g/11h4d3rtn4",
      "rating": 4.9,
      "reviews": 58,
      "type": "Software company",
      "types": [
        "Software company",
        "Computer support and services",
        "E-commerce service",
        "Telecommunications service provider",
        "Web hosting company",
        "Website designer"
      ],
      "type_id": "software_company",
      "type_ids": [
        "software_company",
        "computer_support_and_services",
        "e_commerce_service",
        "telecommunications_service_provider",
        "web_hosting_service",
        "website_designer"
      ],
      "address": "1213, Pearls Omaxe Tower, Netaji Subhash Place, Shakurpur, Delhi, 110034, India",
      "country": "India",
      "open_state": "Open 24 hours",
      "hours": "Open 24 hours",
      "operating_hours": {
        "tuesday": "Open 24 hours",
        "wednesday": "Open 24 hours",
        "thursday": "Open 24 hours",
        "friday": "Open 24 hours",
        "saturday": "Open 24 hours",
        "sunday": "Open 24 hours",
        "monday": "Open 24 hours"
      },
      "phone": "+91 85953 08455",
      "website": "https://e-sutra.com/",
      "extensions": [
        {
          "service_options": [
            "Online appointments",
            "Onsite services"
          ]
        },
        {
          "accessibility": [
            "Wheelchair accessible entrance",
            "Wheelchair accessible parking lot"
          ]
        },
        {
          "planning": [
            "Appointment required"
          ]
        }
      ],
      "service_options": {
        "online_appointments": true,
        "onsite_services": true
      },
      "thumbnail": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAG6xU8CWLkmaqpUr5LF_QdP6cHG-w7FODgu8HwtB4zSuOzKuhEQVwDJyQBs82R9oyfmO54tcHM6MqDmSPbnYEeqUJac7FZ6MNaHS2FZ2P37JPdBdFMSxzAwYnXMHzXGoS8V74_o=w1000-h1000-c-n",
      "serpapi_thumbnail": "https://serpapi.com/images/url/q_BN2HicHcRdDoIgAADgE5FmptbWg2bILBJj9vfSDE23EjRwlBfsDN2mre_h-35qpVo5N4xHPRlVQlSPspflkwmuSq5GTDRG1UrAJJCGT7bp3Y-cV-YtD5t7k3dt9pxu4CUtiMNQBLQLk7DqPaRVYA-0T4Z1X6_SvQ7jdxpIz9rNxPvWJFNbMYQd3IUNJVd-WpVdFufMhWcHb3NELXi2yMSNSREUENPX4OsTP2I0HCNBvb1rX8RCj03TBPV_BvgPKJ5DwQ"
    },
    {
      "position": 6,
      "title": "4TechBugs Technologies Pvt. Ltd",
      "place_id": "ChIJU9u0IuADDTkR1BBnVubqJkU",
      "data_id": "0x390d03e022b4db53:0x4526eae6566710d4",
      "data_cid": "4982928312745005268",
      "reviews_link": "https://serpapi.com/search.json?data_id=0x390d03e022b4db53%3A0x4526eae6566710d4&engine=google_maps_reviews&hl=en",
      "photos_link": "https://serpapi.com/search.json?data_id=0x390d03e022b4db53%3A0x4526eae6566710d4&engine=google_maps_photos&hl=en",
      "gps_coordinates": {
        "latitude": 28.7056339,
        "longitude": 77.12368529999999
      },
      "place_id_search": "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJU9u0IuADDTkR1BBnVubqJkU",
      "provider_id": "/g/1q64py99_",
      "rating": 4.8,
      "reviews": 52,
      "type": "Software company",
      "types": [
        "Software company",
        "Computer software store",
        "Web hosting company",
        "Website designer"
      ],
      "type_id": "software_company",
      "type_ids": [
        "software_company",
        "computer_software_store",
        "web_hosting_service",
        "website_designer"
      ],
      "address": "D-130, Pocket 14, Sector 8D, Rohini, New Delhi, Delhi, 110085, India",
      "country": "India",
      "open_state": "Open · Closes 9 PM",
      "hours": "Open · Closes 9 PM",
      "operating_hours": {
        "tuesday": "9:30 AM–9 PM",
        "wednesday": "9:30 AM–9 PM",
        "thursday": "9:30 AM–9 PM",
        "friday": "9:30 AM–9 PM",
        "saturday": "9:30 AM–9 PM",
        "sunday": "Closed",
        "monday": "9:30 AM–9 PM"
      },
      "phone": "+91 99997 98701",
      "website": "http://www.4techbugs.com/",
      "extensions": [
        {
          "parking": [
            "Free parking lot"
          ]
        }
      ],
      "user_review": "\"I had a fantastic experience working with 4TechBugs Technologies Pvt.\"",
      "thumbnail": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEeevmui60xh6iEaPKVe5oMMGhap95LT7xAbeLt3l4SweBPeEDvuqdkGWgpBGlC5kNYnrRo8-cEvbDdp0HMHv5r8AkNm6__ASLUyWTbKvcFHrkIP4w-fCALQufUTLb2flDaa2qGdQ=w1000-h1000-c-n",
      "serpapi_thumbnail": "https://serpapi.com/images/url/-mXt_XicHcTdboIwGADQJ6rUH9At2UUVBouFwMSZXRkoH9S00EpLcY-4R9jbmOxcnL9fbq02r54n-XrRKdVJmAyMTA0WBrtgqvc6bRAzyHgkzwpBIgDXT7cAP3hwi6r8-AW-StOYV_rFp-X2QWqgdi03pxn2OUShm-6NiC-d3sfy4Ivsexg_1Q6xyNVho3GSJs4fd0RkfXC9khM9_1zK-ujYezKKj3wzo_ZAaDG155LWq1aGVbW6x03xNi8xxoj_z9DwBA5HRXE"
    },
    {
      "position": 7,
      "title": "Perfectiongeeks Technologies",
      "place_id": "ChIJh-NG8moBDTkRjs8cSwEckqs",
      "data_id": "0x390d016af246e387:0xab921c014b1ccf8e",
      "data_cid": "12362974718966157198",
      "reviews_link": "https://serpapi.com/search.json?data_id=0x390d016af246e387%3A0xab921c014b1ccf8e&engine=google_maps_reviews&hl=en",
      "photos_link": "https://serpapi.com/search.json?data_id=0x390d016af246e387%3A0xab921c014b1ccf8e&engine=google_maps_photos&hl=en",
      "gps_coordinates": {
        "latitude": 28.704992299999997,
        "longitude": 77.1031235
      },
      "place_id_search": "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJh-NG8moBDTkRjs8cSwEckqs",
      "provider_id": "/g/11fn1x8hzt",
      "rating": 5,
      "reviews": 37,
      "type": "Software company",
      "types": [
        "Software company",
        "Website designer"
      ],
      "type_id": "software_company",
      "type_ids": [
        "software_company",
        "website_designer"
      ],
      "address": "27/132, Sector 3, Sector 3G, Rohini, Delhi, 110085, India",
      "country": "India",
      "open_state": "Open · Closes 6:30 PM",
      "hours": "Open · Closes 6:30 PM",
      "operating_hours": {
        "tuesday": "9:30 AM–6:30 PM",
        "wednesday": "9:30 AM–12 AM",
        "thursday": "12–6:30 AM, 9:30 AM–6:30 PM",
        "friday": "9:30 AM–6:30 PM",
        "saturday": "Closed",
        "sunday": "Closed",
        "monday": "9:30 AM–6:30 PM"
      },
      "phone": "+91 89209 47884",
      "website": "https://www.perfectiongeeks.com/",
      "extensions": [
        {
          "service_options": [
            "Online appointments"
          ]
        },
        {
          "crowd": [
            "LGBTQ+ friendly"
          ]
        },
        {
          "planning": [
            "Appointment required"
          ]
        }
      ],
      "service_options": {
        "online_appointments": true
      },
      "user_review": "\"Best Company for ios app development.\"",
      "thumbnail": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGj4ylfUkZUkVyNTxMHEe4elzFDX8giUAb1WeYEH01LGAL6rKR1cWWHvHDuOXjPHIat8i9yBaI6OAA2b3HKXrgqB87DSMBbCVGHL3YTFAPkpowQP2UXHMw5OmORMV6ooCxubgH5=w1000-h1000-c-n",
      "serpapi_thumbnail": "https://serpapi.com/images/url/z82MNXicHcTdEoFAGADQJ0olEjMutqLPKCX6c6edtVHatJvkBT2DtzHjXJzvpxCi4QtZrgptRBmjFek4aTGrBanFCLO7TBsuYS5xGQW7fYmc22SoLlF5isp42B1fHqzIhFTvtZ0a9BqhXE1ItgJFdR3k6u02VHGSwBPszk9vAWzOwrjOB_O80X2ExrkG27SlD9OY2QfPzK3YAVfLjmsUlA3r98E4SsHrp_7dD71YZ8x6dTmF6bJXFUWRiv9Yqn_wykMI"
    },
    {
      "position": 8,
      "title": "DeepSpace9 Technologies",
      "place_id": "ChIJK1mcBSQZDTkRBbvzAPFDxZE",
      "data_id": "0x390d1924059c592b:0x91c543f100f3bb05",
      "data_cid": "10503876408293702405",
      "reviews_link": "https://serpapi.com/search.json?data_id=0x390d1924059c592b%3A0x91c543f100f3bb05&engine=google_maps_reviews&hl=en",
      "photos_link": "https://serpapi.com/search.json?data_id=0x390d1924059c592b%3A0x91c543f100f3bb05&engine=google_maps_photos&hl=en",
      "gps_coordinates": {
        "latitude": 28.6905841,
        "longitude": 77.1517968
      },
      "place_id_search": "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJK1mcBSQZDTkRBbvzAPFDxZE",
      "provider_id": "/g/11f03xywrv",
      "rating": 4.9,
      "reviews": 12,
      "type": "Software company",
      "types": [
        "Software company",
        "E commerce agency",
        "E-commerce service"
      ],
      "type_id": "software_company",
      "type_ids": [
        "software_company",
        "e_commerce_agency",
        "e_commerce_service"
      ],
      "address": "1003, 10th Floor, Tower 1, Pearls Omaxe Tower, Netaji Subhash Place, Shakurpur, New Delhi, Delhi, 110034, India",
      "country": "India",
      "open_state": "Open · Closes 8 PM",
      "hours": "Open · Closes 8 PM",
      "operating_hours": {
        "tuesday": "10 AM–8 PM",
        "wednesday": "10 AM–8 PM",
        "thursday": "10 AM–8 PM",
        "friday": "10 AM–8 PM",
        "saturday": "Closed",
        "sunday": "Closed",
        "monday": "10 AM–8 PM"
      },
      "website": "https://www.deepspace9.tech/"
    },
    {
      "position": 9,
      "title": "HindSoft Technology Pvt Ltd. - Website Designing Company in Delhi",
      "place_id": "ChIJlTnvLz4BDTkRYBsxMfhTvRQ",
      "data_id": "0x390d013e2fef3995:0x14bd53f831311b60",
      "data_cid": "1494442976799169376",
      "reviews_link": "https://serpapi.com/search.json?data_id=0x390d013e2fef3995%3A0x14bd53f831311b60&engine=google_maps_reviews&hl=en",
      "photos_link": "https://serpapi.com/search.json?data_id=0x390d013e2fef3995%3A0x14bd53f831311b60&engine=google_maps_photos&hl=en",
      "gps_coordinates": {
        "latitude": 28.706574099999997,
        "longitude": 77.12272279999999
      },
      "place_id_search": "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJlTnvLz4BDTkRYBsxMfhTvRQ",
      "provider_id": "/g/12hlbh5yk",
      "rating": 4.8,
      "reviews": 117,
      "type": "Website designer",
      "types": [
        "Website designer",
        "Web hosting company"
      ],
      "type_id": "website_designer",
      "type_ids": [
        "website_designer",
        "web_hosting_service"
      ],
      "address": "C-7, Pocket 7, Sector 7, Rohini, New Delhi, Delhi, 110085, India",
      "country": "India",
      "open_state": "Open 24 hours",
      "hours": "Open 24 hours",
      "operating_hours": {
        "tuesday": "Open 24 hours",
        "wednesday": "Open 24 hours",
        "thursday": "Open 24 hours",
        "friday": "Open 24 hours",
        "saturday": "Open 24 hours",
        "sunday": "Open 24 hours",
        "monday": "Open 24 hours"
      },
      "phone": "+91 92111 48866",
      "website": "https://www.hindsoft.com/",
      "extensions": [
        {
          "service_options": [
            "Online appointments",
            "Onsite services"
          ]
        }
      ],
      "service_options": {
        "online_appointments": true,
        "onsite_services": true
      },
      "user_review": "\"One of the best It solutions Company.\"",
      "thumbnail": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAF8deurYvszLsTVKZs58PDW2iYfLH-H_cEZAHZmvuezQOc4BPeYnl1KAXTDFmT7AaPXLC1q6ZbFvjDjvd_ZwcQSWajuvW1T-ZRkUY4obBtiJwdDaVBlA-9FxnixliK-gkwcY0jk=w1000-h1000-c-n",
      "serpapi_thumbnail": "https://serpapi.com/images/url/r8Q4T3icHcTbDoIgAADQLyK1e209YOZcutIyDV6aIXlDqEBs_WDf0N-0dR7O91MqdZdLw2DlaFAIUTDaSfokgivK1YCI1ijuEhAJpAHDXdRAd57T7om0fAcyTnwsJ_PQSYcVugUe8C5kg6GHW93Rd7QnYzukiDPLh-fYcdt4BrPwHKytxxRfXV07tc4vuCfRMc3qTqdWDPChOaGxuNqq2va5kyU2g2Dhvnj1YpUPiqYnyKybVW-ZpgnK_wTwH5E8RXk"
    },
    {
      "position": 10,
      "title": "TechPlek Technologies Pvt Ltd",
      "place_id": "ChIJcyb6VSXhDDkR9ci6d0HSxZg",
      "data_id": "0x390ce12555fa2673:0x98c5d24177bac8f5",
      "data_cid": "11008436042800482549",
      "reviews_link": "https://serpapi.com/search.json?data_id=0x390ce12555fa2673%3A0x98c5d24177bac8f5&engine=google_maps_reviews&hl=en",
      "photos_link": "https://serpapi.com/search.json?data_id=0x390ce12555fa2673%3A0x98c5d24177bac8f5&engine=google_maps_photos&hl=en",
      "gps_coordinates": {
        "latitude": 28.692815799999998,
        "longitude": 77.1516754
      },
      "place_id_search": "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJcyb6VSXhDDkR9ci6d0HSxZg",
      "provider_id": "/g/11p5cqly1k",
      "rating": 5,
      "reviews": 13,
      "type": "Software company",
      "types": [
        "Software company",
        "Branding agency",
        "Internet marketing service",
        "Marketing agency",
        "Website designer"
      ],
      "type_id": "software_company",
      "type_ids": [
        "software_company",
        "branding_agency",
        "internet_marketing_service",
        "marketing_agency",
        "website_designer"
      ],
      "address": "404, 4th Floor, 1, Netaji Subhash Place, Pitampura, Delhi, 110034, India",
      "country": "India",
      "open_state": "Open · Closes 7 PM",
      "hours": "Open · Closes 7 PM",
      "operating_hours": {
        "tuesday": "10 AM–7 PM",
        "wednesday": "10 AM–7 PM",
        "thursday": "10 AM–7 PM",
        "friday": "10 AM–7 PM",
        "saturday": "10 AM–7 PM",
        "sunday": "Closed",
        "monday": "10 AM–7 PM"
      },
      "phone": "+91 85952 70747",
      "website": "https://www.techplek.com/",
      "extensions": [
        {
          "service_options": [
            "Online appointments"
          ]
        },
        {
          "crowd": [
            "LGBTQ+ friendly"
          ]
        },
        {
          "planning": [
            "Appointment required"
          ]
        }
      ],
      "service_options": {
        "online_appointments": true
      },
      "user_review": "\"The support we received from TechPlek Technologies has been exceptional.\"",
      "thumbnail": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHoB5HSFtT-QfRz-I73K29JOhmPuxO9ttZ8arfl_YC9mBKc6ENqOHzyLANY221D19UPRkY9nsYMAbPvsUEVlIcyG1vKCiM5nU73sjdX1C-boL54xmIbEKbNzgSCFGj55CtVDv23=w1000-h1000-c-n",
      "serpapi_thumbnail": "https://serpapi.com/images/url/1bK2DnicHcRdEoFAAADgE221ZbFmPGQrJSo_NfJitFKoXexKuqAzuI0Z38P3_ZRS3sRIVavSUArOiyp_ivxBOZM5kwrltVrcBKACCNWMguXVdPkEuWtHbsDytOqANzB8Hc_Cso6ebYil3A0Pj1O1TwmuJz7t28E9dLv33AxSXYcWxHG0uqaYiXRhZlEjYjupPPqewsYn5wVi8cAQl-MWEpDxOeq1tZfZfhZ0xZo40wtCRCZWoxvjF9Q0DZT_KWA_uAlCnQ"
    },
    {
      "position": 11,
      "title": "Dizispark Technology - Digital Marketing Agency in Delhi",
      "place_id": "ChIJW5bRPzoFDTkRz7PuYigUQe0",
      "data_id": "0x390d053a3fd1965b:0xed41142862eeb3cf",
      "data_cid": "17095967824166171599",
      "reviews_link": "https://serpapi.com/search.json?data_id=0x390d053a3fd1965b%3A0xed41142862eeb3cf&engine=google_maps_reviews&hl=en",
      "photos_link": "https://serpapi.com/search.json?data_id=0x390d053a3fd1965b%3A0xed41142862eeb3cf&engine=google_maps_photos&hl=en",
      "gps_coordinates": {
        "latitude": 28.677398099999998,
        "longitude": 77.0926338
      },
      "place_id_search": "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJW5bRPzoFDTkRz7PuYigUQe0",
      "provider_id": "/g/11yvgjb28y",
      "rating": 5,
      "reviews": 75,
      "type": "Internet marketing service",
      "types": [
        "Internet marketing service",
        "Advertising agency",
        "Graphic designer",
        "Marketing consultant",
        "Website designer"
      ],
      "type_id": "internet_marketing_service",
      "type_ids": [
        "internet_marketing_service",
        "advertising_agency",
        "graphic_designer",
        "marketing_consultant",
        "website_designer"
      ],
      "address": "80, Basement, Metro Station Peera Garhi, 487, Metro Wali Gali, near Peeragarhi, Ekta Enclave, Peeragarhi Village, Paschim Vihar, New Delhi, Delhi, 110087, India",
      "country": "India",
      "open_state": "Open · Closes 7 PM",
      "hours": "Open · Closes 7 PM",
      "operating_hours": {
        "tuesday": "10 AM–7 PM",
        "wednesday": "10 AM–7 PM",
        "thursday": "10 AM–7 PM",
        "friday": "10 AM–7 PM",
        "saturday": "10 AM–7 PM",
        "sunday": "Closed",
        "monday": "10 AM–7 PM"
      },
      "phone": "+91 62876 23081",
      "website": "https://dizispark.com/",
      "extensions": [
        {
          "service_options": [
            "Online appointments"
          ]
        },
        {
          "parking": [
            "Free parking lot",
            "On-site parking"
          ]
        }
      ],
      "unsupported_extensions": [
        {
          "service_options": [
            "Onsite services"
          ]
        }
      ],
      "service_options": {
        "online_appointments": true,
        "onsite_services": false
      },
      "user_review": "\"Dizispark Technology is a fantastic digital marketing agency in Delhi.\"",
      "thumbnail": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFGiYDwEdIxAlpbxIytSHjG6kDrK2HZ6cee_l4B87lH3_Z6Ued-b704Y8U5M2SQof0WtbZ89fw6-GoHoLRkFC0yp_-TzNRFLuzb_WUyxSF2usk_tkn17EOrxpZW8RzPj80gnAKZeEI3GU7L=w1000-h1000-c-n",
      "serpapi_thumbnail": "https://serpapi.com/images/url/1I0qUnicHcTbboMgAADQL6JS7ZQ22YNbvaWuF50x5YVESnWFARGMl5_cc_-myc7Def511mqzcxzReatWqVawwbCeKmmZtCuqfp1WG0ANME54Pl54GCc_1_0Y3bIpFLqZstmW6SPx-b4_uCn2KWNEbD5QIFKPYL9iN9AEcHNF1duXW17UHda2wWh7H32QqFTlBY8_4awJ-F6ORZwPS0Pqap7K2B0MJ5bLdRCd-knjGhXL-YFgK8MDZlHmJVWQv49rCCHo_qdAvgBLikZh"
    },
    {
      "position": 12,
      "title": "Appfinz Technologies | Shopify Development Company in Delhi",
      "place_id": "ChIJiwPCn1cDDTkRZReajY3KiX0",
      "data_id": "0x390d03579fc2038b:0x7d89ca8d8d9a1765",
      "data_cid": "9045984035865237349",
      "reviews_link": "https://serpapi.com/search.json?data_id=0x390d03579fc2038b%3A0x7d89ca8d8d9a1765&engine=google_maps_reviews&hl=en",
      "photos_link": "https://serpapi.com/search.json?data_id=0x390d03579fc2038b%3A0x7d89ca8d8d9a1765&engine=google_maps_photos&hl=en",
      "gps_coordinates": {
        "latitude": 28.682956299999997,
        "longitude": 77.17736959999999
      },
      "place_id_search": "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJiwPCn1cDDTkRZReajY3KiX0",
      "provider_id": "/g/11ffm7b6dw",
      "rating": 4.8,
      "reviews": 48,
      "type": "Marketing agency",
      "types": [
        "Marketing agency",
        "E-commerce service",
        "Website designer"
      ],
      "type_id": "marketing_agency",
      "type_ids": [
        "marketing_agency",
        "e_commerce_service",
        "website_designer"
      ],
      "address": "Nr Deep Chand Bandhu Hospital, B590 Ground Floor, Bunkar Colony, Phase 4, Ashok Vihar, New Delhi, Delhi 110052, India",
      "country": "India",
      "open_state": "Open · Closes 7 PM",
      "hours": "Open · Closes 7 PM",
      "operating_hours": {
        "tuesday": "10 AM–7 PM",
        "wednesday": "10 AM–7 PM",
        "thursday": "10 AM–7 PM",
        "friday": "10 AM–7 PM",
        "saturday": "10 AM–7 PM",
        "sunday": "Closed",
        "monday": "10 AM–7 PM"
      },
      "phone": "+91 83407 25097",
      "website": "https://www.appfinz.com/",
      "extensions": [
        {
          "from_the_business": [
            "Identifies as women-owned"
          ]
        },
        {
          "service_options": [
            "Online appointments",
            "Onsite services"
          ]
        },
        {
          "accessibility": [
            "Wheelchair accessible entrance",
            "Wheelchair accessible parking lot",
            "Wheelchair accessible restroom",
            "Wheelchair accessible seating"
          ]
        },
        {
          "amenities": [
            "Gender-neutral restroom"
          ]
        },
        {
          "crowd": [
            "LGBTQ+ friendly"
          ]
        },
        {
          "parking": [
            "Free street parking"
          ]
        }
      ],
      "service_options": {
        "online_appointments": true,
        "onsite_services": true
      },
      "user_review": "\"Best e-commerce website designing company\"",
      "thumbnail": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHyAvUEB3_Jf4i3DX9YZeBiDUeCD71aGi9IAu4ysCmt5kneeWwZxfwnrzDAgtTZnItAmH8e_s9YmPQwbFI9qmU-Fhi2M3zH19P3I7fPASuWnVKZjVcWlaYzCFZ_7Fnn3UvqQTcT=w1000-h1000-c-n",
      "serpapi_thumbnail": "https://serpapi.com/images/url/cNBrlHicHcRNjoIwGADQE1VgisFOMosKImicQASRbog25Ufph9oiygU9g7cx8S3e-1VrfVG_htHWeFJ1XdWKXokb70AL0BPeSaO6KMQVUgaN_uMzDZ70ni7muFiVdoO9PcmZmDdeKlzPsQ7LhoS0t5_KlXp6BiGygT3KAW6jRyudMAg1lcFMFIrkMoqHox-Sq0yRXzc_GzwGFolw6JQR3fYZ7NbstONZe8hH12eF4wPg9H6NE578DZZpmqj-zhF8AFECRL8"
    },
    {
      "position": 13,
      "title": "NexGen Innovators",
      "place_id": "ChIJhxOsqDwBDTkR1WeCUVu4DYo",
      "data_id": "0x390d013ca8ac1387:0x8a0db85b518267d5",
      "data_cid": "9947809854280329173",
      "reviews_link": "https://serpapi.com/search.json?data_id=0x390d013ca8ac1387%3A0x8a0db85b518267d5&engine=google_maps_reviews&hl=en",
      "photos_link": "https://serpapi.com/search.json?data_id=0x390d013ca8ac1387%3A0x8a0db85b518267d5&engine=google_maps_photos&hl=en",
      "gps_coordinates": {
        "latitude": 28.618961,
        "longitude": 77.0322202
      },
      "place_id_search": "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJhxOsqDwBDTkR1WeCUVu4DYo",
      "provider_id": "/g/11b6gkppjx",
      "rating": 4.9,
      "reviews": 239,
      "type": "Website designer",
      "types": [
        "Website designer",
        "Computer support and services",
        "Internet marketing service",
        "Software company",
        "Web hosting company"
      ],
      "type_id": "website_designer",
      "type_ids": [
        "website_designer",
        "computer_support_and_services",
        "internet_marketing_service",
        "software_company",
        "web_hosting_service"
      ],
      "address": "114B, 3rd floor, Dwarka Mor, New Delhi, Delhi 110059, India",
      "country": "India",
      "open_state": "Open · Closes 7 PM",
      "hours": "Open · Closes 7 PM",
      "operating_hours": {
        "tuesday": "10 AM–7 PM",
        "wednesday": "10 AM–7 PM",
        "thursday": "10 AM–7 PM",
        "friday": "10 AM–7 PM",
        "saturday": "10 AM–7 PM",
        "sunday": "Closed",
        "monday": "10 AM–7 PM"
      },
      "website": "https://www.nexgi.com/",
      "extensions": [
        {
          "service_options": [
            "Online appointments",
            "Onsite services"
          ]
        },
        {
          "amenities": [
            "Gender-neutral restroom"
          ]
        },
        {
          "crowd": [
            "LGBTQ+ friendly"
          ]
        }
      ],
      "unsupported_extensions": [
        {
          "accessibility": [
            "Wheelchair accessible entrance",
            "Wheelchair accessible parking lot"
          ]
        }
      ],
      "service_options": {
        "online_appointments": true,
        "onsite_services": true
      },
      "user_review": "\"Highly recommend who are looking for Top IT companies in Delhi ncr.\"",
      "thumbnail": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGZM3tH63I8XjxgqzFWBl02fv2G9VDs_t3qPEuSiGFvT1bLXhi_b6Igz34bgFYkTGIkGMIHQCHOWkZ2czLQ3Qnj2fxhOhZpcZucHC5XcfGYUZYXMGDe2A9WgfdQTu17sLsyeu3Qfm599gli=w1000-h1000-c-n",
      "serpapi_thumbnail": "https://serpapi.com/images/url/rOPkzHicHcTJjoIwAADQL0KgdWOSOaAOhQTEZnCAXkzodEGQxbYu_KTn-RuTeYf395JaD-rDtlsJZ6LvRcuMYlfad5p1ekb7iy0GZVFlKds_7HHjI5JAHS5htC7ODzFOQb5pHcBvAHk_O3XScDx8me8aBbfMreJC1qdqGYkJzisRlE2GogYlUYi3YZo3BNApxhB3Z8AfMpVkoMTQcLsoKEflkZRFgnYM-F4u-C_OjLtSsXoyAzG_LDxPtPXn3XUcx5L_U6t7A1f-RuA"
    },
    {
      "position": 14,
      "title": "Techzonce It Solution LLP",
      "place_id": "ChIJJfXTVpgBDTkR_ONMhQf9ffw",
      "data_id": "0x390d019856d3f525:0xfc7dfd07854ce3fc",
      "data_cid": "18193976278389679100",
      "reviews_link": "https://serpapi.com/search.json?data_id=0x390d019856d3f525%3A0xfc7dfd07854ce3fc&engine=google_maps_reviews&hl=en",
      "photos_link": "https://serpapi.com/search.json?data_id=0x390d019856d3f525%3A0xfc7dfd07854ce3fc&engine=google_maps_photos&hl=en",
      "gps_coordinates": {
        "latitude": 28.7084537,
        "longitude": 77.1426522
      },
      "place_id_search": "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJJfXTVpgBDTkR_ONMhQf9ffw",
      "provider_id": "/g/11vzxp65t8",
      "rating": 4.8,
      "reviews": 12,
      "type": "Software company",
      "types": [
        "Software company",
        "Computer support and services"
      ],
      "type_id": "software_company",
      "type_ids": [
        "software_company",
        "computer_support_and_services"
      ],
      "address": "Block MU, Uttari Pitampura, Pitampura, New Delhi, Delhi, 110034, India",
      "country": "India",
      "open_state": "Open 24 hours",
      "hours": "Open 24 hours",
      "operating_hours": {
        "tuesday": "Open 24 hours",
        "wednesday": "Open 24 hours",
        "thursday": "Open 24 hours",
        "friday": "Open 24 hours",
        "saturday": "Open 24 hours",
        "sunday": "Closed",
        "monday": "Open 24 hours"
      },
      "phone": "+91 93109 10714",
      "website": "https://techzonce.com/",
      "extensions": [
        {
          "service_options": [
            "Onsite services"
          ]
        }
      ],
      "service_options": {
        "onsite_services": true
      },
      "user_review": "\"Best software company it is a good experience for digital marketing\"",
      "thumbnail": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFHsXGt3MAiPIbmBanjYipJbM9EOx_d1x5CehyUL_Q7kQkZKe7HfjmzqbZk12pTnJ_NH2jNUWl13KhpRzF2fQpGXGiTY29vfTeNPIsRwdWCEch8uSwoe8YbXFlUZKQt8ap6HqmfzY9L4ro=w1000-h1000-c-n",
      "serpapi_thumbnail": "https://serpapi.com/images/url/so5u_HicHcRJDoIwAADAFyGbC5h4QCOgKFKFCFyI1ELZ2mqrKI_07m9MnMN8P1gIxuey3GJ9VFJatujB0R1SIhARI0g7uWRcglzishX4oLFsl8eO0PdWFWzybnkhdVKxbb4314dXdlVfkxXC72iXgVkDmtRDM7eou-GWp42qsZBsM9_Vaj86t6ruYXYcbK0AzImdKkw081mEyA82_Nhfz6s1xMbj1FNkJHlst1HqAWFc2NS9dcWQmLvxnS56VVEUCf-HEvkBk3JH3w"
    },
    {
      "position": 15,
      "title": "JY Technologies Consulting Pvt Ltd.",
      "place_id": "ChIJBVZcaOMDDTkRSAj9_lppUQA",
      "data_id": "0x390d03e3685c5605:0x51695afefd0848",
      "data_cid": "22915312659531848",
      "reviews_link": "https://serpapi.com/search.json?data_id=0x390d03e3685c5605%3A0x51695afefd0848&engine=google_maps_reviews&hl=en",
      "photos_link": "https://serpapi.com/search.json?data_id=0x390d03e3685c5605%3A0x51695afefd0848&engine=google_maps_photos&hl=en",
      "gps_coordinates": {
        "latitude": 28.6905841,
        "longitude": 77.1517968
      },
      "place_id_search": "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJBVZcaOMDDTkRSAj9_lppUQA",
      "provider_id": "/g/11sw_1twl3",
      "rating": 4.8,
      "reviews": 54,
      "type": "Marketing agency",
      "types": [
        "Marketing agency",
        "Software company"
      ],
      "type_id": "marketing_agency",
      "type_ids": [
        "marketing_agency",
        "software_company"
      ],
      "address": "FNB-09,10, Pearls Omaxe Tower, Netaji Subhash Place, Pitampura, New Delhi, Delhi, 110034, India",
      "country": "India",
      "open_state": "Open · Closes 7 PM",
      "hours": "Open · Closes 7 PM",
      "operating_hours": {
        "tuesday": "10 AM–7 PM",
        "wednesday": "10 AM–7 PM",
        "thursday": "10 AM–7 PM",
        "friday": "10 AM–7 PM",
        "saturday": "10 AM–2:30 PM",
        "sunday": "Closed",
        "monday": "10 AM–7 PM"
      },
      "phone": "+91 89886 88488",
      "website": "https://jydigitek.com/",
      "extensions": [
        {
          "service_options": [
            "Online appointments",
            "Onsite services"
          ]
        },
        {
          "planning": [
            "Appointment required"
          ]
        }
      ],
      "service_options": {
        "online_appointments": true,
        "onsite_services": true
      },
      "user_review": "\"Team of high professionals is working in JYTECH Company.\"",
      "thumbnail": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHcUUzO6omSVBJ29oumkLTtoXL-Xq_oNxeywMRz0GP7kunrcG38duNnh735YCXyQG2ALNf9j5sBk2DUnzLYj8xacEuxZh0zQy_nJCaoPYqgyIDkPEteDqARWWnrZU3zYm11hoDG=w1000-h1000-c-n",
      "serpapi_thumbnail": "https://serpapi.com/images/url/eW3jqHicHcRLDoIwFADAE1UKxG_iAsWgBhFUFNgQUyuNlT6hbYRe0DN4GxNnMd8PU-olZ5b1ZO6gAqieVEvaEhCKCjUgUFvVSyIikbS8OEq4tyZpavYjqI_nxdaZgq55eFKQhShrSog62r93B4ODeMy1aEngTm46EmzsDvNl1ieB44XRffoYygV3_FSYMH9MuitZ6a5g2CR9KbbLK8R5U_Ubn8crRf3GO1wuoi1S1-S1bTPwg_nbxhgj9p8g8QPAgUXQ"
    },
    {
      "position": 16,
      "title": "CtrlA Tech Solutions Private Limited",
      "place_id": "ChIJ75NRqEEFDTkRvVnH2-QWoSI",
      "data_id": "0x390d0541a85193ef:0x22a116e4dbc759bd",
      "data_cid": "2495300840735594941",
      "reviews_link": "https://serpapi.com/search.json?data_id=0x390d0541a85193ef%3A0x22a116e4dbc759bd&engine=google_maps_reviews&hl=en",
      "photos_link": "https://serpapi.com/search.json?data_id=0x390d0541a85193ef%3A0x22a116e4dbc759bd&engine=google_maps_photos&hl=en",
      "gps_coordinates": {
        "latitude": 28.6657752,
        "longitude": 77.0927662
      },
      "place_id_search": "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJ75NRqEEFDTkRvVnH2-QWoSI",
      "provider_id": "/g/11ry3j0gnk",
      "rating": 5,
      "reviews": 20,
      "unclaimed_listing": true,
      "type": "Software company",
      "types": [
        "Software company"
      ],
      "type_id": "software_company",
      "type_ids": [
        "software_company"
      ],
      "address": "J-6, opposite Raddison Hotel, Block J, Reserve Bank Enclave, Paschim Vihar, New Delhi, Delhi, 110063, India",
      "country": "India",
      "open_state": "Open · Closes 6:30 PM",
      "hours": "Open · Closes 6:30 PM",
      "operating_hours": {
        "tuesday": "9:30 AM–6:30 PM",
        "wednesday": "9:30 AM–6:30 PM",
        "thursday": "9:30 AM–6:30 PM",
        "friday": "9:30 AM–6:30 PM",
        "saturday": "9:30 AM–6:30 PM",
        "sunday": "Closed",
        "monday": "9:30 AM–6:30 PM"
      },
      "phone": "+91 20 3916 6102",
      "website": "https://ctrlatechsolutions.com/",
      "extensions": [
        {
          "service_options": [
            "Online appointments",
            "Onsite services"
          ]
        }
      ],
      "service_options": {
        "online_appointments": true,
        "onsite_services": true
      },
      "user_review": "\"CtrlA know the business and have capability to fill the business vs IT gaps.\"",
      "thumbnail": "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=9kE4a_9PtiwoO6dwgSJABQ&cb_client=search.gws-prod.gps&w=80&h=92&yaw=88.2687&pitch=0&thumbfov=100",
      "serpapi_thumbnail": "https://serpapi.com/images/url/dBGHq3icHc1BDsIgEEDR27ATaGNqa0KMJm7cqPEADaUIE2mHlLHoZbyXt7Fx91fvfz-eKKatEIkma2kGmyO8bEirqLlDdMHqCIkbHMRcCPLPoRs1hF3UI0KvmsdxrdvmQpDxXPXZ3U77w5WZrjUB7EgqWT0Zz11exAl77mJiWdWSedWU7K2XrnlZ1RsWgYxXkv0fd5xVIeUPAfc5Dg"
    },
    {
      "position": 17,
      "title": "Carecone Technologies Pvt Ltd | Reptile It Service | Reptile Tracko",
      "place_id": "ChIJ6VpuJsEDDTkR7tNRJKzPyjc",
      "data_id": "0x390d03c1266e5ae9:0x37cacfac2451d3ee",
      "data_cid": "4020253955632255982",
      "reviews_link": "https://serpapi.com/search.json?data_id=0x390d03c1266e5ae9%3A0x37cacfac2451d3ee&engine=google_maps_reviews&hl=en",
      "photos_link": "https://serpapi.com/search.json?data_id=0x390d03c1266e5ae9%3A0x37cacfac2451d3ee&engine=google_maps_photos&hl=en",
      "gps_coordinates": {
        "latitude": 28.7003913,
        "longitude": 77.1170731
      },
      "place_id_search": "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJ6VpuJsEDDTkR7tNRJKzPyjc",
      "provider_id": "/g/11s7zv31cn",
      "rating": 4.8,
      "reviews": 17,
      "type": "Software company",
      "types": [
        "Software company",
        "Business development service",
        "Business to business service",
        "Computer software store",
        "E-commerce service",
        "Internet marketing service",
        "Marketing agency",
        "Web hosting company",
        "Website designer"
      ],
      "type_id": "software_company",
      "type_ids": [
        "software_company",
        "business_development_service",
        "business_to_business_service",
        "computer_software_store",
        "e_commerce_service",
        "internet_marketing_service",
        "marketing_agency",
        "web_hosting_service",
        "website_designer"
      ],
      "address": "2nd floor, Aggarwal City Plaza, 265, Mangalam Place, Rohini, New Delhi, Delhi 110085, India",
      "country": "India",
      "open_state": "Open · Closes 6:30 PM",
      "hours": "Open · Closes 6:30 PM",
      "operating_hours": {
        "tuesday": "10:30 AM–6:30 PM",
        "wednesday": "10:30 AM–6:30 PM",
        "thursday": "10:30 AM–6:30 PM",
        "friday": "10:30 AM–6:30 PM",
        "saturday": "Closed",
        "sunday": "Closed",
        "monday": "10:30 AM–6:30 PM"
      },
      "phone": "+91 93115 72747",
      "website": "https://reptileitservice.com/",
      "extensions": [
        {
          "service_options": [
            "Online appointments",
            "Onsite services"
          ]
        },
        {
          "accessibility": [
            "Assisted listening devices",
            "Wheelchair accessible entrance",
            "Wheelchair accessible parking lot",
            "Wheelchair accessible restroom",
            "Wheelchair accessible seating"
          ]
        },
        {
          "amenities": [
            "Gender-neutral restroom"
          ]
        },
        {
          "crowd": [
            "LGBTQ+ friendly"
          ]
        },
        {
          "planning": [
            "Appointment required"
          ]
        },
        {
          "parking": [
            "Free parking lot",
            "Free street parking",
            "On-site parking",
            "Paid parking garage",
            "Paid parking lot",
            "Paid street parking"
          ]
        }
      ],
      "unsupported_extensions": [
        {
          "accessibility": [
            "Assistive hearing loop"
          ]
        }
      ],
      "service_options": {
        "online_appointments": true,
        "onsite_services": true
      },
      "user_review": "\"Best app development company in rohini delhi.\"",
      "thumbnail": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHdCp9HnOVjUz75XnLhmRi6us1uIwqdRrrjjaXbkFxglHwWN0I5_IzEJaQZcifzCtMZ1f9t5e-olKJi4nBu7ROPB2wUVA37N4yilF5VFVWsbQ9wg6HF2vdhSmrzf1vucdrMrB_p0Rsj2o6X=w1000-h1000-c-n",
      "serpapi_thumbnail": "https://serpapi.com/images/url/J8xvunicHcRLjoIwAADQE1UKCgQTF2CGgKMoTETixmiBFiwt9mMdLuna20wyb_E-b6LUKJeWRcl8hjnHtNGyEYgz1TA1Q3yw8CgBkkBa4SHL72FSr8cgYfuyP06-W7EtGYrO09LWqXnUhRB9f61u9_iFaWJOGUzdSzp9ba75GXXttFa7s90Gym0Ap9-bbsEi7Rf7Q-SYYxnO_Wzx29HYLePyJG95YLCXxM6zJj-DmFr7qVEtdiK6jLCQvcO9amVsCCEg_yPA_gAUi0hr"
    },
    {
      "position": 18,
      "title": "Candes Technology Private Limited",
      "place_id": "ChIJ7yvrlI0HDTkR8EUHH0ovbWk",
      "data_id": "0x390d078d94eb2bef:0x696d2f4a1f0745f0",
      "data_cid": "7596780141838550512",
      "reviews_link": "https://serpapi.com/search.json?data_id=0x390d078d94eb2bef%3A0x696d2f4a1f0745f0&engine=google_maps_reviews&hl=en",
      "photos_link": "https://serpapi.com/search.json?data_id=0x390d078d94eb2bef%3A0x696d2f4a1f0745f0&engine=google_maps_photos&hl=en",
      "gps_coordinates": {
        "latitude": 28.719656099999998,
        "longitude": 77.1093933
      },
      "place_id_search": "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJ7yvrlI0HDTkR8EUHH0ovbWk",
      "provider_id": "/g/11ngnvnmnm",
      "rating": 2.6,
      "reviews": 706,
      "type": "Electronics company",
      "types": [
        "Electronics company",
        "Electronics manufacturer"
      ],
      "type_id": "electronics_company",
      "type_ids": [
        "electronics_company",
        "electronics_manufacturer"
      ],
      "address": "402, Crown Heights , Plot No.3B1 , Twin District Centre, Sector 10, Rohini, New Delhi, Delhi 110085, India",
      "country": "India",
      "open_state": "Open 24 hours",
      "hours": "Open 24 hours",
      "operating_hours": {
        "tuesday": "Open 24 hours",
        "wednesday": "Open 24 hours",
        "thursday": "Open 24 hours",
        "friday": "Open 24 hours",
        "saturday": "Open 24 hours",
        "sunday": "Open 24 hours",
        "monday": "Open 24 hours"
      },
      "phone": "+91 93102 17042",
      "website": "https://candesworld.com/",
      "extensions": [
        {
          "service_options": [
            "Onsite services"
          ]
        }
      ],
      "service_options": {
        "onsite_services": true
      },
      "user_review": "\"Very Good Product..Thank You Candes Technology..😇\"",
      "thumbnail": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAEnvcSTLBmj2iDX1KWXwOBANz8OOsv3l62QxW6mYyf4elamRNfRGdK3Mq2naw34gRbt7Bjp4m2sJsX-Nw8Kd3RPta0bxNVej4NLsAhPgeECsgn794fRgUnrHKgzwSFxoBPSO1qg=w1000-h1000-c-n",
      "serpapi_thumbnail": "https://serpapi.com/images/url/UNh2u3icHcRbUsIwFADQFYU-kgF0ho9WUMZiWlKV8llCekttksINpLJB1-BunPF8nN-f1rkBH4Ogb-kErIVeXVFdpDVOGTeRVgcwIJFIMEgKvv1KVuYmy_dNqrv4tKyibFf5PE34fZ7neKP9NN6Ou6nefzdM9bUWvBEvx4y-nWNTe8pAHNws7QamY3zFinA_z45UFK4ODyP_VB3jG0zaAtTqCcHMHlgj4MNc1hncffk82rQo8-gMCx-FYUja_yUxf1faRNI"
    },
    {
      "position": 19,
      "title": "Tech Mountains",
      "place_id": "ChIJPXLU21IDDTkRKugCzn9PuSE",
      "data_id": "0x390d0352dbd4723d:0x21b94f7fce02e82a",
      "data_cid": "2430060884278831146",
      "reviews_link": "https://serpapi.com/search.json?data_id=0x390d0352dbd4723d%3A0x21b94f7fce02e82a&engine=google_maps_reviews&hl=en",
      "photos_link": "https://serpapi.com/search.json?data_id=0x390d0352dbd4723d%3A0x21b94f7fce02e82a&engine=google_maps_photos&hl=en",
      "gps_coordinates": {
        "latitude": 28.6905841,
        "longitude": 77.1517968
      },
      "place_id_search": "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJPXLU21IDDTkRKugCzn9PuSE",
      "provider_id": "/g/11vwv51frv",
      "rating": 5,
      "reviews": 3,
      "type": "Software company",
      "types": [
        "Software company"
      ],
      "type_id": "software_company",
      "type_ids": [
        "software_company"
      ],
      "address": "Pearls Omaxe Tower, Netaji Subhash Place, Shakurpur, Delhi, 110034, India",
      "country": "India",
      "open_state": "Open · Closes 6 PM",
      "hours": "Open · Closes 6 PM",
      "operating_hours": {
        "tuesday": "9 AM–6 PM",
        "wednesday": "9 AM–6 PM",
        "thursday": "9 AM–6 PM",
        "friday": "9 AM–6 PM",
        "saturday": "Closed",
        "sunday": "Closed",
        "monday": "9 AM–6 PM"
      },
      "phone": "+91 83685 01801",
      "website": "https://www.techmountains.com/",
      "extensions": [
        {
          "service_options": [
            "Online appointments",
            "Onsite services"
          ]
        }
      ],
      "service_options": {
        "online_appointments": true,
        "onsite_services": true
      },
      "user_review": "\"techmountains is a top-notch firm specializing in web development services.\"",
      "thumbnail": "https://lh3.googleusercontent.com/gps-cs-s/APNQkAF_kCWKpTVcL0FH96GpHGwFGLt1-BiAmWagdbScr9vkSWAsaiE4UtXHOch96335MFJ3pv0-Z6DVruDgXo-06Ss2qrTHtpgUYU8mR95EVy3-Xqr3lEwIkZyYK7lEimLQmjFgAFQg=w1000-h1000-c-n",
      "serpapi_thumbnail": "https://serpapi.com/images/url/ECkYIHicHcRLEsEwAADQE0VDKDVjETQt6lPVDxtDdNJq00QSOk7oDG5jxlu876cwRuqxZdUF6jAhWJ0_da6oaEzemA4V3GJSA6qBtvBuE1aYnKtZupKHhAaQ-I7tSd9riReYLpiWmKcXdrtGVDmvKkqxvpRuPzaZv6WFYyM0WJMlki8ITvY8Uc85ywSAdqR7D3XwjWTxMR7xvTNwkzcC2UOh2m0X1el9XA1rt-RByO-EYRKySduFEILiPwXND8zsQ0k"
    },
    {
      "position": 20,
      "title": "𝐂𝐨𝐫𝐞𝐰𝐚𝐯𝐞",
      "place_id": "ChIJ67PCdqMHDTkRsVwHAwaAIzM",
      "data_id": "0x390d07a376c2b3eb:0x3323800603075cb1",
      "data_cid": "3684929683428170929",
      "reviews_link": "https://serpapi.com/search.json?data_id=0x390d07a376c2b3eb%3A0x3323800603075cb1&engine=google_maps_reviews&hl=en",
      "photos_link": "https://serpapi.com/search.json?data_id=0x390d07a376c2b3eb%3A0x3323800603075cb1&engine=google_maps_photos&hl=en",
      "gps_coordinates": {
        "latitude": 28.7068282,
        "longitude": 77.1227957
      },
      "place_id_search": "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&place_id=ChIJ67PCdqMHDTkRsVwHAwaAIzM",
      "provider_id": "/g/11rjz75wj6",
      "rating": 4.8,
      "reviews": 26,
      "type": "Software company",
      "types": [
        "Software company"
      ],
      "type_id": "software_company",
      "type_ids": [
        "software_company"
      ],
      "address": "Second Floor, C-7/70, D 13, Pocket 7, Sector 7, Rohini, New Delhi, Delhi, 110085, India",
      "country": "India",
      "open_state": "Open · Closes 8 PM",
      "hours": "Open · Closes 8 PM",
      "operating_hours": {
        "tuesday": "9 AM–8 PM",
        "wednesday": "9 AM–8 PM",
        "thursday": "9 AM–8 PM",
        "friday": "9 AM–8 PM",
        "saturday": "9 AM–8 PM",
        "sunday": "Closed",
        "monday": "9 AM–8 PM"
      },
      "phone": "+91 98106 76072",
      "website": "https://www.corewave.io/",
      "extensions": [
        {
          "service_options": [
            "Online appointments",
            "Onsite services"
          ]
        }
      ],
      "service_options": {
        "online_appointments": true,
        "onsite_services": true
      },
      "user_review": "\"Highly recommended Website Development Company in Delhi.\"",
      "thumbnail": "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=DqniFg0LieQoeAcridiWVQ&cb_client=search.gws-prod.gps&w=80&h=92&yaw=100.89567&pitch=0&thumbfov=100",
      "serpapi_thumbnail": "https://serpapi.com/images/url/ZscWkXicHc1NDsIgEEDh27AT0ERtTYgxMa7cdKNLQ-kIk1AYAYvexmt5G3_WL_ne--VKobwRIpcEUCaESvgAn2ekuY3RetCEmZs4imkuiruPfdDot6RDxEHtbwEPVh4Rugg7k3DA86ljpr8YjxCKyqCTcdzWr5jiwC1lVlUjmVPtgj11VXMpedMuV2tGWIxTkv0v1zj90gefrTn-"
    }
  ],
  "serpapi_pagination": {
    "next": "https://serpapi.com/search.json?engine=google_maps&google_domain=google.com&hl=en&ll=%4040.7455096%2C-74.0083012%2C14z&q=Technology+companies+in+delhi&start=20&type=search"
  }
}

const results = data.local_results.map(place => ({
    name: place.title,
    phone_maps: place.phone || 'N/A',
    website: place.website || 'N/A',
    rating: place.rating || 'N/A',
    address: place.address || 'N/A',
}));

async function extractContactInfo(url, browser) {
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

        let contactInfo = await page.evaluate(() => {
            const phoneLink = document.querySelector('a[href^="tel:"]');
            const emailLink = document.querySelector('a[href^="mailto:"]');

            let phone = phoneLink?.textContent.trim()
                || phoneLink?.href.replace('tel:', '').trim()
                || 'N/A';

            let email = emailLink?.textContent.trim()
                || emailLink?.href.replace('mailto:', '').trim()
                || 'N/A';

            if (phone === 'N/A') {
                const bodyText = document.body.innerText;
                const phoneMatch = bodyText.match(
                    /(\+?\d{1,3}[\s\-]?)?\(?\d{3,5}\)?[\s\-]?\d{3,5}[\s\-]?\d{3,5}/
                );
                phone = phoneMatch ? phoneMatch[0].trim() : 'N/A';
            }

            if (email === 'N/A') {
                const bodyText = document.body.innerText;
                const emailMatch = bodyText.match(
                    /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/
                );
                email = emailMatch ? emailMatch[0] : 'N/A';
            }

            return { phone, email };
        });

        if (contactInfo.phone === 'N/A' || contactInfo.email === 'N/A') {
            const contactUrls = [
                new URL('/contact', url).href,
                new URL('/contact-us', url).href,
            ];

            for (const contactUrl of contactUrls) {
                try {
                    await page.goto(contactUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
                    const extra = await page.evaluate(() => {
                        const phoneLink = document.querySelector('a[href^="tel:"]');
                        const emailLink = document.querySelector('a[href^="mailto:"]');

                        let phone = phoneLink?.textContent.trim()
                            || phoneLink?.href.replace('tel:', '').trim()
                            || null;

                        let email = emailLink?.textContent.trim()
                            || emailLink?.href.replace('mailto:', '').trim()
                            || null;

                        if (!phone) {
                            const match = document.body.innerText.match(
                                /(\+?\d{1,3}[\s\-]?)?\(?\d{3,5}\)?[\s\-]?\d{3,5}[\s\-]?\d{3,5}/
                            );
                            phone = match ? match[0].trim() : null;
                        }

                        if (!email) {
                            const match = document.body.innerText.match(
                                /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/
                            );
                            email = match ? match[0] : null;
                        }

                        return { phone, email };
                    });

                    if (contactInfo.phone === 'N/A' && extra.phone) contactInfo.phone = extra.phone;
                    if (contactInfo.email === 'N/A' && extra.email) contactInfo.email = extra.email;
                    if (contactInfo.phone !== 'N/A' && contactInfo.email !== 'N/A') break;
                } catch (_) {}
            }
        }

        return contactInfo;
    } catch (err) {
        return { phone: 'N/A', email: `Error: ${err.message.slice(0, 50)}` };
    } finally {
        await page.close();
    }
}

function exportToCSV(data, filename) {
    const headers = ['Name', 'Phone (Maps)', 'Phone (Website)', 'Email', 'Website', 'Rating', 'Address'];
    const rows = data.map(r => [
        r.name,
        r.phone_maps,
        r.phone_website,
        r.email,
        r.website,
        r.rating,
        r.address,
    ].map(val => `"${String(val).replace(/"/g, '""')}"`)); 

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    fs.writeFileSync(filename, csv, 'utf8');
    console.log(`\n CSV saved to ${filename}`);
}

async function main() {
    const browser = await chromium.launch({ headless: false });
    const finalResults = [];

    for (const r of results) {
        if (r.website === 'N/A') {
            console.log(`⏭  Skipping ${r.name} — no website`);
            finalResults.push({ ...r, phone_website: 'N/A', email: 'N/A' });
            continue;
        }

        console.log(`🔍 Scraping: ${r.name}`);
        const { phone, email } = await extractContactInfo(r.website, browser);

        const entry = { ...r, phone_website: phone, email };
        finalResults.push(entry);
        console.log(`   Phone: ${phone} | Email: ${email}`);
    }

    await browser.close();
    exportToCSV(finalResults, 'results.csv');
}

main().catch(console.error);