"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {AppShell} from "@/components/AppShell";
import {profileEditT} from "@/lib/i18n-profile-edit";
import {createClient} from "@/lib/supabase/client";
import {useClientLocale} from "@/lib/use-client-locale";
import {profileSchema} from "@/lib/validation";

export default function EditProfilePage() {
  const router = useRouter();
  const locale = useClientLocale();
  const t = profileEditT(locale);
  const [id, setId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [school, setSchool] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const s = createClient();
      const {
        data: {user},
      } = await s.auth.getUser();
      if (!user) {
        router.replace("/auth");
        return;
      }
      setId(user.id);
      const {data} = await s.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setDisplayName(data.display_name || "");
        setCity(data.city || "");
        setMunicipality(data.municipality || "");
        setSchool(data.school || "");
        setPhone(data.phone || "");
        setBio(data.bio || "");
        setAvatar(data.avatar_url || "");
      }
    })();
  }, [router]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const parsed = profileSchema.safeParse({display_name: displayName, city, municipality, school, phone, bio});
    if (!parsed.success) {
      setError(t.validation);
      setSaving(false);
      return;
    }
    if (file && (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 3 * 1024 * 1024)) {
      setError(t.uploadError);
      setSaving(false);
      return;
    }
    const s = createClient();
    let avatarUrl = avatar;
    if (file) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = id + "/" + crypto.randomUUID() + "." + ext;
      const up = await s.storage.from("avatars").upload(path, file, {upsert: true, contentType: file.type});
      if (up.error) {
        setError(up.error.message);
        setSaving(false);
        return;
      }
      avatarUrl = s.storage.from("avatars").getPublicUrl(path).data.publicUrl;
    }
    const {error: updateError} = await s
      .from("profiles")
      .update({display_name: displayName, city, municipality, school, phone, bio, avatar_url: avatarUrl})
      .eq("id", id);
    if (updateError) setError(updateError.message);
    else router.push("/profile");
    setSaving(false);
  }

  return (
    <AppShell>
      <section className="profile-edit container">
        <span className="eyebrow">{t.eyebrow}</span>
        <h1>{t.title}</h1>
        <form className="sell-form" onSubmit={save}>
          <label className="avatar-upload">
            {avatar ? <img src={avatar} alt=""/> : <span>{displayName.slice(0, 2).toUpperCase() || "RL"}</span>}
            <input type="file" hidden accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)}/>
            <strong>{t.changePhoto}</strong>
          </label>
          <div className="form-two">
            <label>
              {t.name}
              <input required value={displayName} onChange={e => setDisplayName(e.target.value)}/>
            </label>
            <label>
              {t.school}
              <input value={school} onChange={e => setSchool(e.target.value)} placeholder={t.schoolPlaceholder}/>
            </label>
          </div>
          <div className="form-two">
            <label>
              {t.city}
              <input value={city} onChange={e => setCity(e.target.value)} placeholder={t.cityPlaceholder}/>
            </label>
            <label>
              {t.municipality}
              <input value={municipality} onChange={e => setMunicipality(e.target.value)}/>
            </label>
          </div>
          <label>
            {t.phone}
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder={t.phonePlaceholder}/>
          </label>
          <label>
            {t.bio}
            <textarea rows={4} value={bio} onChange={e => setBio(e.target.value)} maxLength={500}/>
          </label>
          {error && <div className="form-error">{error}</div>}
          <button className="button" disabled={saving}>
            {saving ? t.saving : t.save}
          </button>
        </form>
      </section>
    </AppShell>
  );
}
