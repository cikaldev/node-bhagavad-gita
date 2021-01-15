const fs = require('fs')
const path = require('path')
const axios = require('axios')
const cheerio = require('cheerio')

// default output directory
const dir = './dist'

// check if output dir exists, otherwise create it
if(!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}

// taken from Wikipedia
// https://en.wikipedia.org/wiki/Bhagavad_Gita
const bhagavad_gita = [
  { "chapter": 1, "title": "Arjuna's Vishada Yoga", "verses": 47 },
  { "chapter": 2, "title": "Sankhya Yoga", "verses": 72 },
  { "chapter": 3, "title": "Karma Yoga", "verses": 43 },
  { "chapter": 4, "title": "Jnana Yoga", "verses": 42 },
  { "chapter": 5, "title": "Karma-Sanyasa Yoga", "verses": 29 },
  { "chapter": 6, "title": "Atma Samyama -Yoga", "verses": 47 },
  { "chapter": 7, "title": "Vijnana Yoga", "verses": 30 },
  { "chapter": 8, "title": "Aksara-ParaBrahma Yoga", "verses": 28 },
  { "chapter": 9, "title": "Raja-Vidya-Raja-Guhya Yoga", "verses": 34 },
  { "chapter": 10, "title": "Vibhuti-Vistara Yoga", "verses": 42 },
  { "chapter": 11, "title": "Viswarupa-Darsana Yoga", "verses": 55 },
  { "chapter": 12, "title": "Bhakti Yoga", "verses": 20 },
  { "chapter": 13, "title": "Ksetra-Ksetrajna Vibhaga Yoga", "verses": 34 },
  { "chapter": 14, "title": "Gunatraya-Vibhaga Yoga", "verses": 27 },
  { "chapter": 15, "title": "Purushottama-Prapti Yoga", "verses": 20 },
  { "chapter": 16, "title": "Daivasura-Sampad-Vibhaga Yoga", "verses": 24 },
  { "chapter": 17, "title": "Shraddhatraya-Vibhaga Yoga", "verses": 28 },
  { "chapter": 18, "title": "Moksha-Sanyasa Yoga", "verses": 78 }
]

/**
 * promisePool(int cp | chapterNumber)
 *
 * @return promise
 */
function promisePool(cp) {
  // array as pool for holding promises request
  let promises = []
  
  // array for holding chunk data
  let verseData = []
  
  // make a seed, for iterate throught verse number
  const ver = Array.from({length: cp.verses}, (x,i) => i + 1);
  
  // just loop it,
  for (const i of ver) {
    promises.push(
      axios.get(`https://bhagavadgita.io/chapter/${cp.chapter}/verse/${i}/`).then(res => {
        if (res.status === 200) {
          
          // initiate cheerio with raw string html
          const $ = cheerio.load(res.data)
          
          // building chunk result
          let dataset = {
            verse: i,
            sanskrit: $('.verse-sanskrit b').text().replace(/\||\n|рее\dрее/g, ''),
            transliteration: $('.verse-transliteration i').text().replace(/\n/g, ''),
            meanings: $('.verse-word i').text().replace(/\n/g, ''),
            translation: $('.verse-meaning').text().replace(/\n/g, '')
          }
          
          // push chunk result into verseData
          verseData.push(dataset)
          
          // we want to see what's going on here
          console.log('chapter', cp.chapter, 'verse', i)
        }
      })
    )
  }
  
  // finally, here we check again our pool and
  // ready to send the final results as file.
  Promise.all(promises).then(() => {
    // i got a little trouble here. our verseData numbers is'nt sort correctly,
    // but never mind, i only need 0.15s in my termux for rebuild the index number.
    // i think it's still worth it todo.
    const correct_sort = {
      chapter: cp.chapter,
      title: cp.title,
      verse: cp.verses,
      verses: verseData.sort((a,b) => { return a.verse - b.verse })
    }
    
    // stdout to file, with naming "chapter_{d}.json"
    const finaldata = JSON.stringify(correct_sort, null, 2)
    fs.writeFile(path.join(dir,`chapter_${cp.chapter}.json`), finaldata, err => {
      if (err) throw err;
      
      // continue/stop the fn
      // increase againts index number of chapter
      if ((idx + 1) !== bhagavad_gita.length) {
        console.log(cp)
        
        // increase index number of chapter
        idx += 1;
        
        // repeat the process till, saved data equal our bhagavad_gita length
        console.log(bhagavad_gita.length + '/' + idx)
        promisePool(bhagavad_gita[idx])
      } else {
        fs.writeFileSync(path.join(dir,`chapters.json`), JSON.stringify(bhagavad_gita, null, 2))
        console.log('\ndone process.');
        console.log(`\nYou can see the results inside directory:\n${path.join(__dirname,dir)}\n`)
      }
    })
  })
}

// index number of chapter
// (will increase from inside fn promisePool)
let idx = 0;

// let's run it.
promisePool(bhagavad_gita[idx])