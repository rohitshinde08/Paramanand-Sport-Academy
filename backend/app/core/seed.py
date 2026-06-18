import asyncio
import os
import shutil
import glob
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database.connection import AsyncSessionLocal, engine, Base
from app.models.postgres_models import Admin, Sport, Coach, Achievement, Testimonial, GalleryItem
from app.core.security import get_password_hash

SEED_DATA_DIR = "./seed-data"
UPLOAD_DIR = "./uploads"


def copy_seed_file(src_relative_path: str) -> str:
    """
    Copy a file from seed-data/ to uploads/ (flattening the path).
    Returns the /uploads/<filename> URL path for DB storage.
    Skips copy if file already exists in uploads/.
    """
    src_path = os.path.join(SEED_DATA_DIR, src_relative_path)
    if not os.path.exists(src_path):
        print(f"  WARNING: Seed file not found: {src_path}")
        # Return the path anyway so the DB record is created
        return f"/uploads/{os.path.basename(src_relative_path)}"

    filename = os.path.basename(src_relative_path)
    # Handle potential name collisions by prefixing with parent folder name
    parent = os.path.basename(os.path.dirname(src_relative_path))
    if parent and parent != ".":
        dest_filename = f"{parent}_{filename}"
    else:
        dest_filename = filename

    dest_path = os.path.join(UPLOAD_DIR, dest_filename)

    if not os.path.exists(dest_path):
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        shutil.copy2(src_path, dest_path)
        print(f"  Copied: {src_relative_path} -> uploads/{dest_filename}")
    else:
        print(f"  Already exists: uploads/{dest_filename}")

    return f"/uploads/{dest_filename}"


def copy_seed_folder(folder_relative_path: str) -> list[str]:
    """
    Copy all image/video files from a seed-data subfolder to uploads/.
    Returns list of /uploads/<filename> URL paths.
    """
    src_dir = os.path.join(SEED_DATA_DIR, folder_relative_path)
    if not os.path.isdir(src_dir):
        print(f"  WARNING: Seed folder not found: {src_dir}")
        return []

    urls = []
    parent = os.path.basename(folder_relative_path)
    for f in sorted(os.listdir(src_dir)):
        full_path = os.path.join(src_dir, f)
        if os.path.isfile(full_path):
            ext = os.path.splitext(f)[1].lower()
            if ext in ('.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm'):
                dest_filename = f"{parent}_{f}"
                dest_path = os.path.join(UPLOAD_DIR, dest_filename)
                if not os.path.exists(dest_path):
                    shutil.copy2(full_path, dest_path)
                    print(f"  Copied: {folder_relative_path}/{f} -> uploads/{dest_filename}")
                urls.append(f"/uploads/{dest_filename}")
    return urls


async def seed_data():
    print("Starting database seeding...")

    # Check if seed-data directory exists
    if os.path.isdir(SEED_DATA_DIR):
        print(f"Seed data directory found at: {os.path.abspath(SEED_DATA_DIR)}")
    else:
        print(f"No seed-data directory found at {os.path.abspath(SEED_DATA_DIR)} - skipping file copies.")

    # 1. Create tables if they don't exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    db: AsyncSession = AsyncSessionLocal()

    try:
        # 2. Seed Admin
        admin_username = "admin"
        admin_password = "adminpassword123"

        admin_query = select(Admin).where(Admin.username == admin_username)
        admin_res = await db.execute(admin_query)
        if not admin_res.scalars().first():
            hashed_pwd = get_password_hash(admin_password)
            admin = Admin(username=admin_username, hashed_password=hashed_pwd)
            db.add(admin)
            print(f"Admin user seeded (Username: {admin_username}, Password: {admin_password})")

        # 3. Seed Sports
        sports_data = [
            {
                "name": "Gymnastics",
                "slug": "gymnastics",
                "description": "Welcome to our prestigious gymnastics academy, proudly featuring the largest hall in Nashik equipped with state-of-the-art international gymnastics equipment.",
                "schedule_json": {
                    "Age 3+ (SuperGym Kids)": "Monday to Friday: 6:00pm to 7:00pm",
                    "Age 7+ (Twirling Tigers)": "Monday to Friday: 5:00pm to 6:00pm",
                    "Age 10+ (SkyBound Strikers)": "Monday to Friday: 6:00pm to 8:00pm",
                    "Age 10+ (FlipZone Squad)": "Monday to Friday: 7:00pm to 8:00pm",
                    "Senior Group (Gymnastics Marvel)": "Monday to Saturday: 6:00pm to 8:30pm"
                },
                "image_url": copy_seed_file("allsports/gymnastics.jpg")
            },
            {
                "name": "Basketball",
                "slug": "basketball",
                "description": "Learn the dynamics of dribbling, passing, and shooting. Our basketball coaching focuses on building individual skill sets alongside tactical teamwork.",
                "schedule_json": {
                    "Under 12": "Monday to Friday: 4:30pm to 6:00pm",
                    "Under 16 & Seniors": "Monday to Saturday: 6:00pm to 8:00pm"
                },
                "image_url": copy_seed_file("allsports/basketball.jpg")
            },
            {
                "name": "Badminton",
                "slug": "badminton",
                "description": "Experience professional badminton coaching under Padukone Sports Management certified coaches. Develop speed, coordination, and game tactics.",
                "schedule_json": {
                    "Beginner": "Monday to Friday: 5:00pm to 6:30pm",
                    "Advanced": "Monday to Saturday: 6:30pm to 8:30pm"
                },
                "image_url": copy_seed_file("allsports/badminton.jpg")
            },
            {
                "name": "Cricket",
                "slug": "cricket",
                "description": "Complete professional cricket coaching with physical fitness drills, net practice sessions, and match simulations.",
                "schedule_json": {
                    "Junior Group": "Monday to Friday: 4:00pm to 6:00pm",
                    "Senior Net Practice": "Monday to Saturday: 6:30am to 9:00am"
                },
                "image_url": copy_seed_file("allsports/cricket.jpg")
            },
            {
                "name": "Football",
                "slug": "football",
                "description": "AIFF licensed coaches guide students through structured training drills, endurance workouts, and tactical awareness on the pitch.",
                "schedule_json": {
                    "All Groups": "Monday to Saturday: 5:00pm to 7:00pm"
                },
                "image_url": copy_seed_file("allsports/football.jpg")
            },
            {
                "name": "Archery",
                "slug": "archery",
                "description": "Hone your concentration, stability, and precision. We offer training with standard recurve and compound bows under expert guidance.",
                "schedule_json": {
                    "All Groups": "Monday to Friday: 4:00pm to 6:00pm"
                },
                "image_url": copy_seed_file("allsports/archery.jpg")
            },
            {
                "name": "Skating",
                "slug": "skating",
                "description": "Dynamic skating classes focusing on speed, balance, and posture for recreation and professional competitions.",
                "schedule_json": {
                    "Beginner": "Monday to Friday: 5:30pm to 6:30pm",
                    "Speed Skating": "Monday to Saturday: 6:30pm to 8:00pm"
                },
                "image_url": copy_seed_file("allsports/skating.jpg")
            },
            {
                "name": "Dance",
                "slug": "dance",
                "description": "Expressive movement and rhythm lessons spanning multiple genres including traditional and contemporary dance.",
                "schedule_json": {
                    "General Batch": "Monday, Wednesday, Friday: 5:30pm to 7:00pm"
                },
                "image_url": copy_seed_file("allsports/dance.jpg")
            },
            {
                "name": "Chess",
                "slug": "chess",
                "description": "Boost your strategic thinking and analytical skills. Guided by FIDE rated coaches, players learn opening, middle, and endgame strategies.",
                "schedule_json": {
                    "All levels": "Tuesday, Thursday, Saturday: 5:00pm to 6:30pm"
                },
                "image_url": copy_seed_file("allsports/chess.jpg")
            },
            {
                "name": "Fencing",
                "slug": "fencing",
                "description": "Master the art of fencing with epee, foil, and sabre classes taught by certified National level coaches.",
                "schedule_json": {
                    "General Practice": "Monday to Friday: 5:30pm to 7:30pm"
                },
                "image_url": copy_seed_file("allsports/fencing.jpg")
            },
            {
                "name": "Mallakhamba",
                "slug": "mallakhamba",
                "description": "Learn Mallakhamba, the traditional Indian sport combining gymnastics, yoga, and martial arts on a wooden pole.",
                "schedule_json": {
                    "General Training": "Monday to Saturday: 5:30pm to 7:30pm"
                },
                "image_url": copy_seed_file("allsports/mallakhamba.jpg")
            },
            {
                "name": "Taekwondo",
                "slug": "taekwondo",
                "description": "Certified martial arts curriculum focusing on self-defense, discipline, speed, and standard sparring techniques.",
                "schedule_json": {
                    "All Levels": "Monday to Friday: 6:00pm to 7:30pm"
                },
                "image_url": copy_seed_file("taikondo/DSC_1496.JPG")
            }
        ]

        for sport in sports_data:
            s_query = select(Sport).where(Sport.slug == sport["slug"])
            s_res = await db.execute(s_query)
            if not s_res.scalars().first():
                db.add(Sport(**sport))
        print("Sports seeded.")

        # 4. Seed Coaches
        coaches_data = [
            {
                "name": "Manav Phule",
                "specialty": "Gymnastics coach",
                "bio": "A certified NIS and BPED coach, Dso national and Junior association national medalist. Manav has over 6+ years of experience in Men's artistic gymnastics.",
                "image_url": copy_seed_file("manav.jpeg")
            },
            {
                "name": "Pranav Sawai",
                "specialty": "Badminton Coach",
                "bio": "Experienced badminton coach with over 6 years of coaching expertise. He holds a certification from Padukone Sports Management (PSM).",
                "image_url": copy_seed_file("pranav.jpeg")
            },
            {
                "name": "Raj Kale",
                "specialty": "Gymnastics Coach",
                "bio": "A senior national medalist who has represented Maharashtra state at various national competitions. 10+ years of experience in artistic gymnastics.",
                "image_url": copy_seed_file("raj.jpg")
            },
            {
                "name": "Santosh Bhalerao",
                "specialty": "Mallakhamba Coach",
                "bio": "Mallakhamba, a traditional Indian sport, requires skilled coaches. Santosh boasts more than 20 years of experience in Mallakhamba coaching.",
                "image_url": copy_seed_file("santosh.jpg")
            },
            {
                "name": "Rahul Fadol",
                "specialty": "Fencing Coach",
                "bio": "A certified National Level Coach from Netaji Subhash National Institute of Sports, Rahul has over six years of experience in Fencing.",
                "image_url": copy_seed_file("rahul.jpeg")
            },
            {
                "name": "Sunil Deshmukh",
                "specialty": "Football Coach",
                "bio": "Sunil is an accomplished football coach with a wealth of experience. He holds an AIFF licensed coach certification.",
                "image_url": copy_seed_file("sunil.jpeg")
            },
            {
                "name": "Rahul Jadhav",
                "specialty": "Basketball Coach",
                "bio": "Led the Nashik District Basketball U-16 boys' team to a third-place finish in the 2012 inter-district state level championship.",
                "image_url": copy_seed_file("rahulbsk1.jpeg")
            },
            {
                "name": "Pushkar Jadhav",
                "specialty": "Chess Coach",
                "bio": "FIDE Arbiter and a FIDE Rating of 1232, Coach Pushkar brings extensive knowledge and chess expertise to his students.",
                "image_url": copy_seed_file("pushkaar.jpg")
            }
        ]

        for coach in coaches_data:
            c_query = select(Coach).where(Coach.name == coach["name"])
            c_res = await db.execute(c_query)
            if not c_res.scalars().first():
                db.add(Coach(**coach))
        print("Coaches seeded.")

        # 5. Seed Achievements
        achievements_data = [
            {
                "title": "Ram Kothawale",
                "category": "Gymnastics",
                "description": "Ram won CISCE National Gymnastics Championship 2022 held in Mumbai.",
                "image_url": copy_seed_file("ram.jpg"),
                "year": 2022
            },
            {
                "title": "Krishna Ambekar",
                "category": "Mallakhamb",
                "description": "Krishna was selected for national games 2022 in Gujarat and secured a silver medal.",
                "image_url": copy_seed_file("malhakhamb1.jpg"),
                "year": 2022
            },
            {
                "title": "Chetan Mankare",
                "category": "Mallakhamb",
                "description": "Chetan represented SPPU university at Khelo India university games and bagged a silver medal.",
                "image_url": copy_seed_file("chetan.jpg"),
                "year": 2022
            },
            {
                "title": "Aman Patil",
                "category": "Archery",
                "description": "Aman Patil won Gold medal in South Zone 2 Archery Championship and got selected for nationals.",
                "image_url": copy_seed_file("archery.jpg"),
                "year": 2022
            }
        ]

        for ach in achievements_data:
            a_query = select(Achievement).where(Achievement.title == ach["title"])
            a_res = await db.execute(a_query)
            if not a_res.scalars().first():
                db.add(Achievement(**ach))
        print("Achievements seeded.")

        # 6. Seed Testimonials
        testimonials_data = [
            {
                "parent_name": "Namrata Bhosle",
                "relationship": "parent",
                "feedback": "My Son & Daughter have been coming to Parmanand sports academy for Gymnastics classes. They are learning a lot and the coach always shares progress.",
                "image_url": "https://cdn.hswstatic.com/gif/play/0b7f4e9b-f59c-4024-9f06-b3dc12850ab7-1920-1080.jpg"
            },
            {
                "parent_name": "Christian Bake",
                "relationship": "parent",
                "feedback": "Outstanding facilities and very dedicated coaches. The level of personal attention each child gets is highly commendable.",
                "image_url": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            }
        ]

        for test in testimonials_data:
            t_query = select(Testimonial).where(Testimonial.parent_name == test["parent_name"])
            t_res = await db.execute(t_query)
            if not t_res.scalars().first():
                db.add(Testimonial(**test))
        print("Testimonials seeded.")

        # 7. Seed Gallery Items (from individual files in sport subfolders)
        gallery_data = [
            {"category": "events", "image_url": copy_seed_file("events/e1.jpg"), "title": "Inauguration Event"},
            {"category": "events", "image_url": copy_seed_file("events/e2.jpg"), "title": "Championship Gathering"},
            {"category": "basket", "image_url": copy_seed_file("basketball/basketballimg1.jpg"), "title": "Girls U-16 Team"},
            {"category": "badminton", "image_url": copy_seed_file("badminton/badminton1.jpg"), "title": "Courts Training"},
            {"category": "gym", "image_url": copy_seed_file("gymnastics/g1.jpg"), "title": "Floor Routine Practice"},
            {"category": "cricket", "image_url": copy_seed_file("cricket/DSC_1257.JPG"), "title": "Net Practice Session"},
            {"category": "archery", "image_url": copy_seed_file("archery/archery1.jpg"), "title": "South Zone Championship"},
            {"category": "fencing", "image_url": copy_seed_file("fencing/fencing1.jpg"), "title": "Epee Training Group"},
            {"category": "mall", "image_url": copy_seed_file("mallakhamba/khamb1 (1).jpg"), "title": "Pole Demonstration"}
        ]

        # Also seed remaining gallery images from sport subfolders
        sport_gallery_folders = {
            "gym": "gymnastics",
            "basket": "basketball",
            "badminton": "badminton",
            "cricket": "cricket",
            "skating": "skating",
            "football": "football",
            "archery": "archery",
            "fencing": "fencing",
            "mall": "mallakhamba",
            "dance": "dance",
            "chess": "chess",
            "taekwondo": "taikondo",
            "events": "events",
        }

        # Collect already-seeded URLs to avoid duplicates
        seeded_urls = set(item["image_url"] for item in gallery_data)

        for category, folder in sport_gallery_folders.items():
            folder_path = os.path.join(SEED_DATA_DIR, folder)
            if os.path.isdir(folder_path):
                for f in sorted(os.listdir(folder_path)):
                    full_path = os.path.join(folder_path, f)
                    if os.path.isfile(full_path):
                        ext = os.path.splitext(f)[1].lower()
                        if ext in ('.jpg', '.jpeg', '.png', '.gif', '.webp'):
                            url = copy_seed_file(f"{folder}/{f}")
                            if url not in seeded_urls:
                                gallery_data.append({
                                    "category": category,
                                    "image_url": url,
                                    "title": ""
                                })
                                seeded_urls.add(url)

        for item in gallery_data:
            g_query = select(GalleryItem).where(GalleryItem.image_url == item["image_url"])
            g_res = await db.execute(g_query)
            if not g_res.scalars().first():
                db.add(GalleryItem(**item))
        print("Gallery items seeded.")

        # 8. Copy remaining loose media files (videos, misc images) to uploads
        if os.path.isdir(SEED_DATA_DIR):
            print("Copying remaining loose media files...")
            for f in os.listdir(SEED_DATA_DIR):
                full_path = os.path.join(SEED_DATA_DIR, f)
                if os.path.isfile(full_path):
                    ext = os.path.splitext(f)[1].lower()
                    if ext in ('.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm'):
                        dest_path = os.path.join(UPLOAD_DIR, f)
                        if not os.path.exists(dest_path):
                            shutil.copy2(full_path, dest_path)
                            print(f"  Copied loose file: {f}")

        await db.commit()
        print("Database seeding completed successfully!")

    except Exception as e:
        await db.rollback()
        print(f"Error during seeding: {str(e)}")
        raise e
    finally:
        await db.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
